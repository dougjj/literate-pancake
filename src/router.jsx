import { createBrowserRouter } from 'react-router-dom';
import Home from './routes/Home';
import Category from './routes/Category';
import Aggregate from './routes/Aggregate';

export default createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    loader: () => fetch('/api/categories').then(r => r.json())
  },
  {
    path: '/category/:id',
    element: <Category />,
    loader: ({ params }) => fetch(`/api/category/${params.id}`).then(r => r.json())
  },
  {
    path: '/category/:id/aggregate',
    element: <Aggregate />,
    loader: ({ params }) => fetch(`/api/category/${params.id}/aggregate`).then(r => r.json())
  }
]);
