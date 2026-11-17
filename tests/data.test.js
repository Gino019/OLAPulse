import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const csv = fs.readFileSync(new URL('../public/data/sales.csv', import.meta.url), 'utf-8');

test('sample dataset has one header and exactly 4,800 records', () => {
  const rows = csv.trim().split(/\r?\n/);
  assert.equal(rows.length, 4801);
  assert.equal(rows[0], 'order_id,order_date,region,category,product,channel,segment,quantity,unit_price,discount,revenue,profit');
});

test('synthetic records cover 2023–2025, with no PII column', () => {
  const header = csv.slice(0, csv.indexOf('\n'));
  assert.doesNotMatch(header, /email|phone|address|customer_name/i);
  assert.match(csv, /OP-00001,202[345]-\d\d-\d\d/);
  assert.match(csv, /2023-/);
  assert.match(csv, /2024-/);
  assert.match(csv, /2025-/);
});
