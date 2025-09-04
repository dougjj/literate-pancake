import { useLoaderData, Link } from 'react-router-dom';

export default function Home() {
  const categories = useLoaderData();
  return (
    <div className="container">
      <h1>Tier Rankings</h1>
      <ul>
        {Object.entries(categories).map(([id, cat]) => (
          <li key={id}>
            <Link to={`/category/${id}`}>{cat.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
