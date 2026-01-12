import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const client =
  process.env.NODE_ENV === "production"
    ? postgres({
        host: process.env.DB_HOST,  // Private IP を指定 (例: 10.23.45.67)
        port: 5432,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
      })
    : postgres(process.env.DATABASE_URL!);


export const db = drizzle(client, { schema });
