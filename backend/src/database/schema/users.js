import { integer, pgTable, text, uuid } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
    id: uuid().primaryKey().defaultRandom(),
    email: text().notNull(),
    password: text().notNull(),
    code: integer(),
})