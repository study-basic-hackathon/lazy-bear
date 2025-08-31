import { pgTable, uuid, numeric, timestamp } from "drizzle-orm/pg-core";

export const personas = pgTable("persona", {
  personaId: uuid("persona_id").primaryKey().defaultRandom(),
  weekdayHours: numeric("weekday_hours", { precision: 4, scale: 1 }).notNull(),
  weekendHours: numeric("weekend_hours", { precision: 4, scale: 1 }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});
