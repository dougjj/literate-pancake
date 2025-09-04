import json
from pathlib import Path

def test_categories_file():
  data = json.loads(Path('data/categories.json').read_text())
  assert 'beatles' in data and 'nolan' in data
