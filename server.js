import express from 'express';
import path from 'path';
import fs from 'fs';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(process.cwd(), 'dist')));

const categoriesPath = path.join(process.cwd(), 'data', 'categories.json');
const votesPath = path.join(process.cwd(), 'data', 'votes.json');

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writeJson(p, data) {
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

app.get('/api/categories', (req, res) => {
  const categories = readJson(categoriesPath);
  res.json(categories);
});

app.get('/api/category/:id', (req, res) => {
  const categories = readJson(categoriesPath);
  const category = categories[req.params.id];
  if (!category) return res.status(404).json({error:'Not found'});
  res.json(category);
});

app.post('/api/category/:id/submit', (req, res) => {
  const { id } = req.params;
  const rankings = req.body.rankings || {};
  const votes = readJson(votesPath);
  votes[id] = votes[id] || [];
  votes[id].push(rankings);
  writeJson(votesPath, votes);
  res.json({status:'ok'});
});

const TIER_SCORE = {S:5, A:4, B:3, C:2, D:1, F:0};

app.get('/api/category/:id/aggregate', (req, res) => {
  const { id } = req.params;
  const categories = readJson(categoriesPath);
  const cat = categories[id];
  if (!cat) return res.status(404).json({error:'Not found'});
  const votes = readJson(votesPath);
  const catVotes = votes[id] || [];
  const totals = {}; const counts = {};
  catVotes.forEach(v => {
    Object.entries(v).forEach(([item, tier]) => {
      totals[item] = (totals[item] || 0) + TIER_SCORE[tier];
      counts[item] = (counts[item] || 0) + 1;
    });
  });
  const tierGroups = {S:[],A:[],B:[],C:[],D:[],F:[]};
  cat.items.forEach(item => {
    const score = totals[item.id] ? totals[item.id] / counts[item.id] : 0;
    let tier = 'F';
    for (const [t,s] of Object.entries(TIER_SCORE)) {
      if (score >= s) { tier = t; break; }
    }
    tierGroups[tier].push(item);
  });
  res.json({category: cat.name, tiers: tierGroups});
});

app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
