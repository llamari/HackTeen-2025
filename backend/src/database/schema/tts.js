import { doublePrecision, pgTable, text, uuid, vector } from "drizzle-orm/pg-core";
import { users } from './users.js';

export const texts = pgTable('texts', {
    id: uuid().primaryKey().defaultRandom(),
    content: text().notNull(),
    user_id: uuid().references(() => users.id).notNull(),
  embeddings: doublePrecision('embeddings').array().notNull(),
})