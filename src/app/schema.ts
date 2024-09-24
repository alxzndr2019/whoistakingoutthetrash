import { pgTable, serial, text, boolean, date } from "drizzle-orm/pg-core";

export const flatmates = pgTable("flatmates", {
  id: serial("id").primaryKey(),
  identifier: text("identifier").notNull(),
  isBusy: boolean("is_busy").notNull().default(false),
  streak: serial("streak").notNull().default(0),
  lastCleanedDate: date("last_cleaned_date"),
  busyUntil: date("busy_until"),
});
