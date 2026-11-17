import * as duckdb from '@duckdb/duckdb-wasm';

let database;
let connection;

export async function startDatabase(datasetUrl) {
  // Official DuckDB-Wasm CDN-bundle strategy: a blob wraps the cross-origin worker.
  const bundle = await duckdb.selectBundle(duckdb.getJsDelivrBundles());
  const workerURL = URL.createObjectURL(new Blob([
    `importScripts(${JSON.stringify(bundle.mainWorker)});`,
  ], { type: 'text/javascript' }));

  try {
    const worker = new Worker(workerURL);
    database = new duckdb.AsyncDuckDB(new duckdb.ConsoleLogger(), worker);
    await database.instantiate(bundle.mainModule, bundle.pthreadWorker);
    connection = await database.connect();

    const response = await fetch(datasetUrl);
    if (!response.ok) throw new Error(`CSV download failed (${response.status})`);
    const buffer = new Uint8Array(await response.arrayBuffer());
    await database.registerFileBuffer('olapulse_sales.csv', buffer);
    await connection.query(`
      CREATE TABLE sales AS
      SELECT * FROM read_csv_auto('olapulse_sales.csv', HEADER = TRUE, SAMPLE_SIZE = -1);
    `);
    return await query('SELECT COUNT(*)::INTEGER AS rows FROM sales');
  } finally {
    URL.revokeObjectURL(workerURL);
  }
}

export async function query(sql) {
  if (!connection) throw new Error('DuckDB engine not initialized');
  const result = await connection.query(sql);
  const names = result.schema.fields.map((field) => field.name);
  return result.toArray().map((row) => {
    const values = {};
    for (const name of names) {
      const value = row[name];
      values[name] = typeof value === 'bigint' ? Number(value) : value;
    }
    return values;
  });
}

export async function closeDatabase() {
  if (connection) await connection.close();
  if (database) await database.terminate();
  connection = undefined;
  database = undefined;
}
