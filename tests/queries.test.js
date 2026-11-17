import test from 'node:test';
import assert from 'node:assert/strict';
import { whereClause, operationQuery, operationDescription, analyticsQueries, OPERATIONS } from '../src/queries.js';

test('year, region, category and channel become analytical filters', () => {
  assert.equal(whereClause({ year: '2025', region: 'North', category: 'Electronics', channel: 'Online' }),
    "WHERE EXTRACT(YEAR FROM order_date) = 2025 AND region = 'North' AND category = 'Electronics' AND channel = 'Online'");
});

test('unrecognized filter values cannot inject SQL', () => {
  assert.equal(whereClause({ year: '2025 OR 1=1', region: "North'; DROP TABLE sales; --" }), '');
});

test('all OLAP operations generate SQL and explanatory copy', () => {
  assert.deepEqual(OPERATIONS, ['slice', 'dice', 'drilldown', 'rollup', 'pivot']);
  for (const op of OPERATIONS) {
    assert.match(operationQuery(op, { year: '2025' }), /FROM sales/);
    assert.ok(operationDescription(op).title.length);
  }
});

test('roll-up is implemented by SQL ROLLUP and pivot uses conditional aggregation', () => {
  assert.match(operationQuery('rollup'), /GROUP BY ROLLUP/);
  assert.match(operationQuery('pivot'), /CASE WHEN channel = 'Online'/);
});

test('all main KPIs and dashboard data are computed with SQL', () => {
  const queries = analyticsQueries({ year: '2025' });
  assert.equal(Object.keys(queries).length, 5);
  assert.match(queries.kpis, /SUM\(profit\)/);
  assert.match(queries.trend, /GROUP BY 1 ORDER BY 1/);
});
