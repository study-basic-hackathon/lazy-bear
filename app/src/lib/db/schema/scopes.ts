import { pgTable, uuid, varchar, text } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const scopes = pgTable("scope", {
  scopeId: uuid("scopeId").primaryKey().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => projects.projectId),
  scope: varchar("scope").notNull(),
  description: text("description").notNull(),
});
