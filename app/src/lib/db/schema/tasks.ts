import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  pgEnum,
} from "drizzle-orm/pg-core";
import { steps } from "./steps";

export const taskStatus = pgEnum("taskStatus", [
  "undo",
  "doing",
  "done",
  "blocked",
]);

export const tasks = pgTable("task", {
  taskId: uuid("taskId").primaryKey().defaultRandom(),
  stepId: uuid("stepId")
    .notNull()
    .references(() => steps.stepId),
  title: varchar("title").notNull(),
  theme: text("description").notNull(),
  startDate: date("startDate").notNull(),
  endDate: date("endDate").notNull(),
  taskStatus: taskStatus("taskStatus").notNull().default("undo"),
});
