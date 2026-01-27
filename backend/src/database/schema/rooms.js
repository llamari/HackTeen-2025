import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const rooms = pgTable('rooms', {
    id: uuid().primaryKey().defaultRandom(),
    name: text().notNull(),
    description: text(),
    createdAt: timestamp().defaultNow().notNull(),
    createdBy: uuid().references(() => users.id).notNull(),
})