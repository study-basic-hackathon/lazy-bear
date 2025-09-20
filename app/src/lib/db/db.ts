import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client =
  process.env.NODE_ENV === "production"
    ? postgres({
        // Cloud SQL Unix ソケットを利用
        host: process.env.INSTANCE_CONNECTION_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: 5432, // PostgreSQL デフォルト
      })
    : postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
