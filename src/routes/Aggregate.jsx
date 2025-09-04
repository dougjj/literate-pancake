import { useLoaderData, Link, useParams } from 'react-router-dom';

const TIERS = ['S','A','B','C','D','F'];

export default function Aggregate() {
  const data = useLoaderData();
  const { id } = useParams();
  return (
    <div className="aggregate">
      <h2>{data.category} - Aggregate</h2>
      <Link to={`/category/${id}`}>Back</Link>
      <div className="tiers">
        {TIERS.map(tier => (
          <div key={tier} className="tier">
            <h3>{tier}</h3>
            <div className="tier-items">
              {data.tiers[tier].map(item => (
                <div key={item.id} className="card">
                  <img src={item.image} alt="" />
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
