import Chart from 'chart.js/auto';
import './styles.css';
import { startDatabase, query } from './database.js';
import { analyticsQueries, operationQuery, operationDescription, OPERATIONS } from './queries.js';

const $ = (selector) => document.querySelector(selector);
const STATE = { year: '2025', region: 'all', category: 'all', channel: 'all', op: 'slice' };
const colors = ['#6857e8', '#24c7b6', '#ffb15e', '#66a9ef', '#e079bb'];
const charts = {};
let isReady = false;
let currentRows = [];
let refreshToken = 0;
const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const decimalUSD = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 });
const shortUSD = (amount) => amount >= 1e6 ? `$${(amount / 1e6).toFixed(1)}M` : amount >= 1e3 ? `$${(amount / 1e3).toFixed(1)}K` : usd.format(amount);

function notify(message) {
  const toast = $('#toast');
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toast.classList.remove('visible'), 3000);
}

function setStatus(text, state) {
  const el = $('#db-status');
  el.innerHTML = `<span class="pulse-dot"></span> ${text}`;
  el.dataset.state = state;
}

function chartDefaults() {
  Chart.defaults.color = '#8892ac';
  Chart.defaults.font.family = "'Inter', system-ui, sans-serif";
  Chart.defaults.font.size = 11;
  Chart.defaults.plugins.legend.display = false;
}

function showChart(id, type, labels, dataset, options = {}) {
  if (charts[id]) charts[id].destroy();
  const axis = ['line', 'bar'].includes(type);
  charts[id] = new Chart($(id), {
    type,
    data: { labels, datasets: [{
      data: dataset,
      backgroundColor: type === 'doughnut' ? colors : type === 'line' ? 'rgba(104, 87, 232, .10)' : '#6857e8',
      borderColor: type === 'line' ? '#6857e8' : type === 'doughnut' ? '#ffffff' : '#6857e8',
      borderWidth: type === 'line' ? 3 : type === 'doughnut' ? 4 : 0,
      fill: type === 'line', tension: 0.35,
      pointRadius: type === 'line' ? 2 : 0,
      pointHoverRadius: type === 'line' ? 6 : 0,
      borderRadius: type === 'bar' ? 6 : 0,
      maxBarThickness: 28,
      hoverOffset: 5,
    }] },
    options: {
      responsive: true, maintainAspectRatio: false,
      cutout: type === 'doughnut' ? '74%' : undefined,
      plugins: { tooltip: { padding: 10, callbacks: { label: (ctx) => ` ${decimalUSD.format(Number(ctx.parsed?.y ?? ctx.parsed?.x ?? ctx.parsed ?? 0))}` } } },
      scales: axis ? {
        x: { grid: { display: false }, border: { display: false }, ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 8 }, ...options.x },
        y: { beginAtZero: true, grid: { color: '#edf0f8' }, border: { display: false }, ticks: { callback: (value) => shortUSD(value) }, ...options.y },
      } : {},
      ...options.main,
    },
  });
}

function renderMetrics(rows) {
  const kpi = rows[0] || { revenue: 0, profit: 0, orders: 0, margin: 0 };
  $('#metric-revenue').textContent = shortUSD(Number(kpi.revenue));
  $('#metric-profit').textContent = shortUSD(Number(kpi.profit));
  $('#metric-orders').textContent = Number(kpi.orders).toLocaleString('en-US');
  $('#metric-margin').textContent = `${Number(kpi.margin).toFixed(1)}%`;
}

function renderTopProducts(rows) {
  $('#top-products').replaceChildren();
  if (!rows.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td'); td.colSpan = 3; td.textContent = 'No products match these filters.';
    tr.append(td); $('#top-products').append(tr); return;
  }
  rows.forEach((item, index) => {
    const tr = document.createElement('tr');
    const values = [`${index + 1}.  ${item.product}`, item.category, usd.format(Number(item.revenue))];
    values.forEach((value, idx) => {
      const td = document.createElement('td'); td.textContent = value;
      if (idx === 2) td.className = 'table-numeric';
      if (idx === 1) td.className = 'table-muted';
      tr.append(td);
    });
    $('#top-products').append(tr);
  });
}

function renderLegends(rows) {
  const legend = $('#category-legend'); legend.replaceChildren();
  const total = rows.reduce((acc, r) => acc + Number(r.revenue), 0);
  rows.forEach((entry, i) => {
    const item = document.createElement('div'); item.className = 'legend-item';
    const dot = document.createElement('span'); dot.className = 'legend-dot'; dot.style.backgroundColor = colors[i];
    const label = document.createElement('span'); label.textContent = entry.category;
    const value = document.createElement('strong'); value.textContent = `${total ? (Number(entry.revenue) / total * 100).toFixed(0) : 0}%`;
    item.append(dot, label, value); legend.append(item);
  });
}

function renderResult(rows) {
  currentRows = rows;
  const headers = rows[0] ? Object.keys(rows[0]) : [];
  $('#result-count').textContent = `${rows.length} rows`;
  const thead = $('#result-table thead');
  const tbody = $('#result-table tbody');
  thead.replaceChildren(); tbody.replaceChildren();
  if (!rows.length) {
    const tr = document.createElement('tr'); const cell = document.createElement('td');
    cell.textContent = 'No records found for this combination of filters.';
    tr.append(cell); tbody.append(tr); return;
  }
  const headRow = document.createElement('tr');
  headers.forEach((key) => { const cell = document.createElement('th'); cell.textContent = key.toUpperCase().replaceAll('_', ' '); headRow.append(cell); });
  thead.append(headRow);
  rows.forEach((row) => {
    const tr = document.createElement('tr');
    headers.forEach((key) => {
      const td = document.createElement('td');
      const value = row[key];
      td.textContent = typeof value === 'number' ? Number(value).toLocaleString('en-US', { maximumFractionDigits: 2 }) : String(value ?? '—');
      tr.append(td);
    });
    tbody.append(tr);
  });
}

function displayOperation() {
  const details = operationDescription(STATE.op);
  $('#operation-type').textContent = STATE.op.replace('drilldown', 'drill-down').toUpperCase();
  $('#operation-title').textContent = details.title;
  $('#operation-description').textContent = details.text;
  $('#sql-code').textContent = operationQuery(STATE.op, STATE);
  document.querySelectorAll('[data-op]').forEach((button) => {
    const active = button.dataset.op === STATE.op;
    button.classList.toggle('active', active);
    button.setAttribute('aria-selected', String(active));
  });
}

async function runOperation() {
  if (!isReady) return;
  displayOperation();
  const sql = operationQuery(STATE.op, STATE);
  const started = performance.now();
  try {
    const rows = await query(sql);
    renderResult(rows);
    $('#execution-note').textContent = `Query completed in ${(performance.now() - started).toFixed(0)} ms · Powered by DuckDB-Wasm · Local execution`;
  } catch (error) {
    $('#execution-note').textContent = `SQL error: ${error.message}`;
    renderResult([]);
  }
}

async function refresh() {
  if (!isReady) return;
  const myToken = ++refreshToken;
  const q = analyticsQueries(STATE);
  try {
    const [kpis, trend, categories, regions, products] = await Promise.all([
      query(q.kpis), query(q.trend), query(q.categories), query(q.regions), query(q.products),
    ]);
    if (myToken !== refreshToken) return;
    renderMetrics(kpis);
    showChart('#chart-trend', 'line', trend.map(r => r.month), trend.map(r => Number(r.revenue)));
    showChart('#chart-category', 'doughnut', categories.map(r => r.category), categories.map(r => Number(r.revenue)));
    showChart('#chart-regions', 'bar', regions.map(r => r.region), regions.map(r => Number(r.revenue)), { main: { indexAxis: 'y' }, x: { ticks: { callback: (v) => shortUSD(v) } }, y: { ticks: { callback: (v) => regions[v]?.region ?? v }, grid: { display: false } } });
    renderLegends(categories);
    renderTopProducts(products);
    await runOperation();
  } catch (error) {
    setStatus('Query failed', 'error');
    notify(`Analytical query failed: ${error.message}`);
    console.error(error);
  }
}

function exportCSV(rows) {
  if (!rows.length) { notify('No rows available to export.'); return; }
  const keys = Object.keys(rows[0]);
  const cell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const csv = [keys.map(cell).join(','), ...rows.map((r) => keys.map((k) => cell(r[k])).join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a'); a.href = url; a.download = `olapulse-${STATE.op}-results.csv`;
  a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function wireInteractions() {
  for (const name of ['year', 'region', 'category', 'channel']) {
    $(`#filter-${name}`).addEventListener('change', (event) => {
      STATE[name] = event.target.value;
      refresh();
    });
  }
  $('#reset-filters').addEventListener('click', () => {
    Object.assign(STATE, { year: '2025', region: 'all', category: 'all', channel: 'all' });
    ['year', 'region', 'category', 'channel'].forEach((name) => { $(`#filter-${name}`).value = STATE[name]; });
    refresh(); notify('Filters have been reset.');
  });
  document.querySelectorAll('[data-op]').forEach((button) => {
    button.addEventListener('click', () => { STATE.op = button.dataset.op; displayOperation(); runOperation(); });
  });
  $('#run-query').addEventListener('click', runOperation);
  $('#copy-sql').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText($('#sql-code').textContent); notify('SQL copied to clipboard.'); }
    catch { notify('Clipboard permissions blocked copying.'); }
  });
  $('#download-results').addEventListener('click', () => exportCSV(currentRows));
  document.querySelectorAll('.nav-link').forEach((link) => link.addEventListener('click', () => {
    document.querySelectorAll('.nav-link').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  }));
}

async function boot() {
  chartDefaults();
  wireInteractions();
  displayOperation();
  try {
    const datasetUrl = `${import.meta.env.BASE_URL}data/sales.csv`;
    $('#dataset-link').href = datasetUrl;
    const count = await startDatabase(datasetUrl);
    isReady = true;
    setStatus('DuckDB engine ready', 'ready');
    await refresh();
    console.info(`OLAPulse loaded ${count[0]?.rows} sales records`);
  } catch (error) {
    console.error('DuckDB initialization failed', error);
    setStatus('Engine unavailable', 'error');
    $('#sql-code').textContent = `-- Database initialization failed:\n-- ${error.message}`;
    $('#execution-note').textContent = 'Check network access to the DuckDB-Wasm CDN and refresh the page.';
    notify(`Could not initialize DuckDB: ${error.message}`);
  }
}

boot();
