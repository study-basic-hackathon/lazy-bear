import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  integer,
} from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const steps = pgTable("step", {
  stepId: uuid("stepId").primaryKey().defaultRandom(),
  projectId: uuid("projectId")
    .notNull()
    .references(() => projects.projectId),
  title: varchar("title").notNull(),
  theme: text("theme").notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  index: integer("index").notNull().default(0),
});
