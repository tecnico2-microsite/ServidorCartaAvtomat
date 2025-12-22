import sql, { ConnectionPool } from "mssql";
import { env } from "./env";
import { serverError } from "../middleware/errorHandler";

const config = {
  server: env.DB_URL,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME,
  options: {
    trustServerCertificate: true,
  },
};

let pool: ConnectionPool | null = null;

export const getPool = async () => {
  try {
    if (pool) return pool;

    pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error(err);
    throw new serverError("Error SQL");
    
  }
};
