import type { RouteObject, LoaderFunctionArgs, ActionFunctionArgs } from "react-router-dom";
import { Outlet, Link, useLoaderData, redirect, Form, useFetcher } from "react-router-dom";
import { categories, Category, Item } from "./data";
import * as React from "react";

const TIERS = ["S", "A", "B", "C", "D"] as const;

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, loader: categoriesLoader, element: <Home /> },
      {
        path: "category/:slug",
        loader: categoryLoader,
        action: categoryAction,
        element: <CategoryPage />,
      },
      {
        path: "aggregate/:slug",
        loader: aggregateLoader,
        element: <AggregatePage />,
      },
      { path: "*", element: <NoMatch /> },
    ],
  },
];

function Layout() {
  return (
    <div>
      <h1>Tier Ranking</h1>
      <Outlet />
    </div>
  );
}

async function categoriesLoader() {
  return categories.map(({ slug, name }) => ({ slug, name }));
}

function Home() {
  const data = useLoaderData<typeof categoriesLoader>();
  return (
    <div>
      <h2>Categories</h2>
      <ul>
        {data.map((c) => (
          <li key={c.slug}>
            <Link to={`category/${c.slug}`}>{c.name}</Link> |{" "}
            <Link to={`aggregate/${c.slug}`}>Aggregated</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function categoryLoader({ params }: LoaderFunctionArgs) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) {
    throw new Response("Not Found", { status: 404 });
  }
  return category;
}

async function readData() {
  const fs = await import("fs/promises");
  const path = (await import("path")).default;
  const file = path.resolve("./submissions.json");
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return {} as any;
  }
}

async function writeData(data: any) {
  const fs = await import("fs/promises");
  const path = (await import("path")).default;
  const file = path.resolve("./submissions.json");
  await fs.writeFile(file, JSON.stringify(data, null, 2));
}

async function categoryAction({ request, params }: ActionFunctionArgs) {
  const form = await request.formData();
  const ranking = JSON.parse(String(form.get("ranking")) || "{}");
  const slug = params.slug as string;
  const data = await readData();
  if (!data[slug]) data[slug] = {};
  for (const [itemId, tier] of Object.entries(ranking)) {
    if (!data[slug][itemId]) {
      data[slug][itemId] = { S: 0, A: 0, B: 0, C: 0, D: 0 };
    }
    data[slug][itemId][tier as string]++;
  }
  await writeData(data);
  return redirect(`/aggregate/${slug}`);
}

function CategoryPage() {
  const category = useLoaderData<Category>();
  const fetcher = useFetcher();
  const [tiers, setTiers] = React.useState<Record<string, Item[]>>(() => {
    const init: Record<string, Item[]> = {};
    TIERS.forEach((t) => (init[t] = []));
    return init;
  });
  const [unranked, setUnranked] = React.useState<Item[]>(category.items);

  const moveItem = (id: string, to: string) => {
    const item = category.items.find((i) => i.id === id);
    if (!item) return;
    setTiers((prev) => {
      const next: Record<string, Item[]> = {} as any;
      TIERS.forEach((t) => {
        next[t] = prev[t].filter((i) => i.id !== id);
      });
      if (TIERS.includes(to as any)) {
        next[to] = [...next[to], item];
      }
      return next;
    });
    setUnranked((prev) => {
      const list = prev.filter((i) => i.id !== id);
      return to === "unranked" ? [...list, item] : list;
    });
  };

  const onDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("id", id);
  };
  const onDrop = (e: React.DragEvent, tier: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("id");
    moveItem(id, tier);
  };
  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleSubmit = () => {
    const ranking: Record<string, string> = {};
    TIERS.forEach((t) => tiers[t].forEach((item) => (ranking[item.id] = t)));
    const form = new FormData();
    form.append("ranking", JSON.stringify(ranking));
    fetcher.submit(form, { method: "post" });
  };

  return (
  <div>
    <h2>{category.name}</h2>
    <div className="tier-board">
      {TIERS.map((t) => (
        <div
          key={t}
          className="tier"
          onDrop={(e) => onDrop(e, t)}
          onDragOver={onDragOver}
        >
          <h3>{t}</h3>
          {tiers[t].map((item) => (
            <div
              key={item.id}
              className="item"
              draggable
              onDragStart={(e) => onDragStart(e, item.id)}
            >
              <img src={item.image} alt={item.title} width={48} />
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
    <h3>Unranked</h3>
    <div className="unranked" onDrop={(e) => onDrop(e, "unranked")} onDragOver={onDragOver}>
      {unranked.map((item) => (
        <div
          key={item.id}
          className="item"
          draggable
          onDragStart={(e) => onDragStart(e, item.id)}
        >
          <img src={item.image} alt={item.title} width={48} />
          <span>{item.title}</span>
        </div>
      ))}
    </div>
    <button onClick={handleSubmit} disabled={fetcher.state === "submitting"}>
      Submit
    </button>
  </div>
  );
}

async function aggregateLoader({ params }: LoaderFunctionArgs) {
  const category = categories.find((c) => c.slug === params.slug);
  if (!category) throw new Response("Not Found", { status: 404 });
  const data = await readData();
  const catData = data[params.slug as string] || {};
  const tiers: Record<string, Item[]> = {} as any;
  TIERS.forEach((t) => (tiers[t] = []));
  category.items.forEach((item) => {
    const counts = catData[item.id] || {};
    let best = TIERS[TIERS.length - 1];
    let bestVal = -1;
    TIERS.forEach((t) => {
      const val = counts[t] || 0;
      if (val > bestVal) {
        bestVal = val;
        best = t;
      }
    });
    tiers[best].push(item);
  });
  return { category, tiers };
}

function AggregatePage() {
  const data = useLoaderData<typeof aggregateLoader>();
  return (
    <div>
      <h2>{data.category.name} - Aggregated</h2>
      {TIERS.map((t) => (
        <div key={t}>
          <h3>{t}</h3>
          <div className="unranked">
            {data.tiers[t].map((item) => (
              <div key={item.id} className="item">
                <img src={item.image} alt={item.title} width={48} />
                <span>{item.title}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Go to the home page</Link>
      </p>
    </div>
  );
}
