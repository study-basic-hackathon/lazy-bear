import { pgTable, uuid, varchar, integer } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const weights = pgTable("weight", {
  weightId: uuid("weightId").primaryKey().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => projects.projectId),
  area: varchar("area").notNull(),
  weightPercent: integer("weightPercent").notNull().default(0),
});
