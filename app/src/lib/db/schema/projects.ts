import { pgTable, uuid, pgEnum, varchar, date } from "drizzle-orm/pg-core";
import { personas } from "./personas";

export const baseMaterial = pgEnum("baseMaterial", ["TEXTBOOK", "VIDEO"]);

export const projects = pgTable("project", {
  projectId: uuid("projectId").primaryKey().defaultRandom(),
  personaId: uuid("personaId")
    .notNull()
    .references(() => personas.personaId),
  certificationName: varchar("certificationName").notNull(),
  examDate: date("examDate").notNull(),
  learningPattern: baseMaterial("baseMaterial").notNull().default("TEXTBOOK"),
});
