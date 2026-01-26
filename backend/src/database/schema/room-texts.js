import { doublePrecision, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { rooms } from "./rooms.js";

export const roomTexts = pgTable('roomTexts', {
    id: uuid().primaryKey().defaultRandom(),
    roomId: uuid().references(() => rooms.id).notNull(),
    transcript: text().notNull(),
    embeddings: doublePrecision('embeddings').array().notNull(),
    createdAt: timestamp().defaultNow().notNull()
})