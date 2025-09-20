import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client =
  process.env.NODE_ENV === "production"
    ? postgres({
        host: '172.16.0.2', // プライベートIPアドレスを指定
        port: 5432,        // TCP接続のためポートを再度追加
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      })
    : postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });
