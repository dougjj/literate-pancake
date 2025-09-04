import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const submissions = {};

app.post('/api/submit', (req, res) => {
  const { categoryId, tiers } = req.body;
  if (!categoryId || !tiers) {
    return res.status(400).json({ error: 'categoryId and tiers required' });
  }
  if (!submissions[categoryId]) {
    submissions[categoryId] = [];
  }
  submissions[categoryId].push(tiers);
  res.json({ status: 'ok' });
});

app.get('/api/aggregate/:categoryId', (req, res) => {
  const { categoryId } = req.params;
  const votes = submissions[categoryId] || [];
  const result = { S: [], A: [], B: [], C: [], D: [], unranked: [] };
  const counts = {};
  votes.forEach(tiers => {
    Object.entries(tiers).forEach(([tier, items]) => {
      items.forEach(item => {
        if (!counts[item]) counts[item] = { S:0, A:0, B:0, C:0, D:0 };
        counts[item][tier] += 1;
      });
    });
  });
  Object.entries(counts).forEach(([item, tierCounts]) => {
    const bestTier = Object.entries(tierCounts).sort((a,b)=>b[1]-a[1])[0][0];
    result[bestTier].push(item);
  });
  res.json(result);
});

app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
