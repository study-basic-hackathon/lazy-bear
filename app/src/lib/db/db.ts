import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// PostgreSQL接続文字列を環境変数から取得
const connectionString = process.env.DATABASE_URL!;

// PostgreSQL接続クライアント
const client = postgres(connectionString);

// Drizzle ORMインスタンスをエクスポート
export const db = drizzle(client, { schema });
