import { defineConfig } from "drizzle-kit";
import process from "node:process";

const dbCredentials =
  process.env.NODE_ENV === "production"
    ? {
        host: process.env.DB_HOST!,
        user: process.env.DB_USER!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_NAME!,
        port: 5432,
      }
    : {
        url: process.env.DATABASE_URL!,
      };

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema/index.ts",
  out: "./src/lib/db/migrations",
  casing: "camelCase",
  dbCredentials,
});