import mysql from "mysql2/promise";

let pool;
const tableCache = new Map();

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
      connectionLimit: 10,
      ssl: { rejectUnauthorized: true },
    });
  }
  return pool;
}

export async function query(sql, params = []) {
  const [rows] = await getPool().execute(sql, params);
  return rows;
}

export async function hasTable(tableName) {
  if (tableCache.has(tableName)) {
    return tableCache.get(tableName);
  }

  try {
    const rows = await query(
      `SELECT COUNT(*) AS count
       FROM information_schema.tables
       WHERE table_schema = ? AND table_name = ?`,
      [process.env.DB_NAME, tableName]
    );
    const exists = !!rows[0]?.count;
    tableCache.set(tableName, exists);
    return exists;
  } catch (error) {
    return false;
  }
}
