/**
 * SQL expressions are built only from a finite set of controlled values.
 * No user-supplied free-form SQL is interpolated into these queries.
 */
const CATEGORIES = new Set(['Electronics', 'Furniture', 'Office Supplies', 'Accessories']);
const REGIONS = new Set(['North', 'South', 'East', 'West']);
const CHANNELS = new Set(['Online', 'Retail', 'Partner']);
const YEARS = new Set(['2023', '2024', '2025']);

export function whereClause(filters = {}) {
  const parts = [];
  if (YEARS.has(String(filters.year))) parts.push(`EXTRACT(YEAR FROM order_date) = ${Number(filters.year)}`);
  if (REGIONS.has(filters.region)) parts.push(`region = '${filters.region}'`);
  if (CATEGORIES.has(filters.category)) parts.push(`category = '${filters.category}'`);
  if (CHANNELS.has(filters.channel)) parts.push(`channel = '${filters.channel}'`);
  return parts.length ? `WHERE ${parts.join(' AND ')}` : '';
}

export function analyticsQueries(filters) {
  const where = whereClause(filters);
  return {
    kpis: `SELECT ROUND(COALESCE(SUM(revenue), 0), 2)::DOUBLE AS revenue,
      ROUND(COALESCE(SUM(profit), 0), 2)::DOUBLE AS profit,
      COUNT(*)::INTEGER AS orders,
      ROUND(CASE WHEN SUM(revenue) > 0 THEN SUM(profit) * 100 / SUM(revenue) ELSE 0 END, 2)::DOUBLE AS margin
      FROM sales ${where};`,
    trend: `SELECT strftime(order_date, '%Y-%m') AS month,
      ROUND(SUM(revenue), 2)::DOUBLE AS revenue
      FROM sales ${where} GROUP BY 1 ORDER BY 1;`,
    categories: `SELECT category, ROUND(SUM(revenue), 2)::DOUBLE AS revenue
      FROM sales ${where} GROUP BY 1 ORDER BY 2 DESC;`,
    regions: `SELECT region, ROUND(SUM(revenue), 2)::DOUBLE AS revenue
      FROM sales ${where} GROUP BY 1 ORDER BY 2 DESC;`,
    products: `SELECT product, category, ROUND(SUM(revenue), 2)::DOUBLE AS revenue
      FROM sales ${where} GROUP BY 1, 2 ORDER BY 3 DESC LIMIT 5;`,
  };
}

const descriptions = {
  slice: { title: 'Focus on one category', text: 'Fix one dimension of the cube (category) and compare its regional sales.' },
  dice: { title: 'Compare multiple dimensions', text: 'Select a subcube of regions and channels before aggregating by category.' },
  drilldown: { title: 'Move from category to product', text: 'Reveal a more detailed level of the product hierarchy.' },
  rollup: { title: 'Aggregate with subtotals', text: 'Travel upward in the hierarchy using SQL ROLLUP and subtotal rows.' },
  pivot: { title: 'Turn channels into columns', text: 'Rotate the analytical view into a cross-tab of regional sales channels.' },
};

export function operationQuery(op, filters = {}) {
  const base = whereClause(filters);
  // Append additional restrictions while respecting the selected dashboard filters.
  const combined = (conditions) => base
    ? `${base} AND ${conditions}`
    : `WHERE ${conditions}`;
  switch (op) {
    case 'slice': {
      const category = CATEGORIES.has(filters.category) ? filters.category : 'Electronics';
      return `-- SLICE: isolate a category\nSELECT region, ROUND(SUM(revenue), 2)::DOUBLE AS revenue,\n  COUNT(*)::INTEGER AS orders\nFROM sales\n${combined(`category = '${category}'`)}\nGROUP BY region\nORDER BY revenue DESC;`;
    }
    case 'dice':
      return `-- DICE: analyze a smaller subcube\nSELECT category, region, channel,\n  ROUND(SUM(revenue), 2)::DOUBLE AS revenue\nFROM sales\n${combined("region IN ('North', 'West') AND channel IN ('Online', 'Partner')")}\nGROUP BY category, region, channel\nORDER BY revenue DESC\nLIMIT 12;`;
    case 'drilldown':
      return `-- DRILL-DOWN: category -> product\nSELECT category, product,\n  ROUND(SUM(revenue), 2)::DOUBLE AS revenue,\n  COUNT(*)::INTEGER AS orders\nFROM sales ${base}\nGROUP BY category, product\nORDER BY category, revenue DESC\nLIMIT 15;`;
    case 'rollup':
      return `-- ROLL-UP: detail -> regional subtotal -> grand total\nSELECT COALESCE(region, 'ALL REGIONS') AS region,\n  COALESCE(category, 'ALL CATEGORIES') AS category,\n  ROUND(SUM(revenue), 2)::DOUBLE AS revenue\nFROM sales ${base}\nGROUP BY ROLLUP (region, category)\nORDER BY region NULLS LAST, category NULLS LAST;`;
    case 'pivot':
      return `-- PIVOT: channels as columns\nSELECT region,\n  ROUND(SUM(CASE WHEN channel = 'Online' THEN revenue ELSE 0 END), 2)::DOUBLE AS online,\n  ROUND(SUM(CASE WHEN channel = 'Retail' THEN revenue ELSE 0 END), 2)::DOUBLE AS retail,\n  ROUND(SUM(CASE WHEN channel = 'Partner' THEN revenue ELSE 0 END), 2)::DOUBLE AS partner\nFROM sales ${base}\nGROUP BY region\nORDER BY region;`;
    default:
      throw new Error(`Unsupported OLAP operation: ${op}`);
  }
}

export function operationDescription(op) {
  return descriptions[op] || descriptions.slice;
}

export const OPERATIONS = Object.freeze(Object.keys(descriptions));
