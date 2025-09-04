import { useLoaderData, useParams, Link } from 'react-router-dom';
import { useState } from 'react';

const TIERS = ['S','A','B','C','D','Unranked'];

export default function Category() {
  const data = useLoaderData();
  const { id } = useParams();
  const [tierItems, setTierItems] = useState(() => {
    const init = {};
    TIERS.forEach(t => init[t] = []);
    init['Unranked'] = data.items;
    return init;
  });

  const onDragStart = (e, item, from) => {
    e.dataTransfer.setData('item', JSON.stringify({id: item.id, from}));
  };

  const onDrop = (e, tier) => {
    e.preventDefault();
    const payload = e.dataTransfer.getData('item');
    if (!payload) return;
    const { id:itemId, from } = JSON.parse(payload);
    if (from === tier) return;
    setTierItems(prev => {
      const copy = {...prev};
      const item = copy[from].find(i => i.id === itemId);
      copy[from] = copy[from].filter(i => i.id !== itemId);
      copy[tier] = [...copy[tier], item];
      return copy;
    });
  };

  const onDragOver = e => e.preventDefault();

  const handleSubmit = async () => {
    const rankings = {};
    TIERS.filter(t => t !== 'Unranked').forEach(t => {
      tierItems[t].forEach(item => rankings[item.id] = t);
    });
    await fetch(`/api/category/${id}/submit`, {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({rankings})
    });
    alert('Submitted!');
  };

  return (
    <div className="category">
      <h2>{data.name}</h2>
      <Link to={`/category/${id}/aggregate`}>View Aggregate</Link>
      <div className="tiers">
        {TIERS.map(tier => (
          <div key={tier} className="tier" onDrop={e => onDrop(e, tier)} onDragOver={onDragOver}>
            <h3>{tier}</h3>
            <div className="tier-items">
              {tierItems[tier].map(item => (
                <div key={item.id} className="card" draggable onDragStart={e => onDragStart(e, item, tier)}>
                  <img src={item.image} alt="" />
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
