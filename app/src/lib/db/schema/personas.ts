import { pgTable, uuid, decimal, pgEnum } from "drizzle-orm/pg-core";

export const learningEnum = pgEnum("learningEnum", [
  "インプット先行パターン",
  "アウトプット先行パターン",
]);

export const personas = pgTable("persona", {
  personaId: uuid("personaId").primaryKey().defaultRandom(),
  weekdayHours: decimal("weekdayHours", { precision: 3, scale: 1 }).notNull(),
  weekendHours: decimal("weekendHours", { precision: 3, scale: 1 }).notNull(),
  learningPattern: learningEnum("learningEnum")
    .notNull()
    .default("インプット先行パターン"),
});
