import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import categories from '../data/categories.js';

const tiers = ['S', 'A', 'B', 'C', 'D', 'unranked'];

export default function Aggregate() {
  const { categoryId } = useParams();
  const category = categories[categoryId];
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(`/api/aggregate/${categoryId}`)
      .then(res => res.json())
      .then(setData);
  }, [categoryId]);

  if (!category) return <p>Category not found</p>;
  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h2>Aggregate: {category.title}</h2>
      <div style={{ display: 'flex', gap: '8px' }}>
        {tiers.map(tier => (
          <div key={tier} style={{ border: '1px solid #ccc', minHeight: '200px', width: '150px' }}>
            <h4 style={{ textAlign: 'center' }}>{tier.toUpperCase()}</h4>
            {data[tier]?.map(id => {
              const item = category.items.find(i => i.id === id);
              return (
                <div key={id} style={{ padding: '4px', margin: '4px', background: '#eee', textAlign: 'center' }}>
                  <img src={item.image} alt="" style={{ width: '100px', height: '100px' }} />
                  <div>{item.name}</div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
