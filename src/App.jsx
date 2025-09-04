import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './routes/Home.jsx';
import Category from './routes/Category.jsx';
import Aggregate from './routes/Aggregate.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:categoryId" element={<Category />} />
        <Route path="/aggregate/:categoryId" element={<Aggregate />} />
      </Routes>
    </BrowserRouter>
  );
}
