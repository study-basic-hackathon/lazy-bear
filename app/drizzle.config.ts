import { defineConfig } from "drizzle-kit";
import process from "node:process";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/lib/db/schema/index.ts",
  out: "./src/lib/db/migrations",
  casing: "camelCase",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});