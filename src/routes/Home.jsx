import { Link } from 'react-router-dom';
import categories from '../data/categories.js';

export default function Home() {
  return (
    <div>
      <h1>Choose a Category</h1>
      <ul>
        {Object.entries(categories).map(([id, { title }]) => (
          <li key={id}>
            <Link to={`/category/${id}`}>{title}</Link>
            {" "}|{" "}
            <Link to={`/aggregate/${id}`}>View Aggregate</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
