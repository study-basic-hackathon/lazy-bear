import { Connector } from "@google-cloud/cloud-sql-connector";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const connector = new Connector();

const client = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ...await connector.getOptions({
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME!,
    ipType: "PUBLIC",
  }),
});

export const db = drizzle(client, { schema });