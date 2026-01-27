import { db } from "../database/connection.js"
import { schema } from "../database/schema/index.js"
import { roomTexts } from "../database/schema/room-texts.js"
import { generateAnswer, generateEmbeddings, transcribeAudio } from "../utils/gemini.js"
import { count, eq, sql } from "drizzle-orm"

export const CreateRoomService = async (name, description, userId) => {
    const newRoom = await db.insert(schema.rooms).values({
        name: name,
        description: description,
        createdBy: userId
    }).returning();

    return newRoom[0];
}

export const GetRoomsService = async (userId) => {
    const rooms = await db.select({
        id: schema.rooms.id,
        name: schema.rooms.name,
        description: schema.rooms.description,
        questionsCount: count(schema.questions.id),
        createdAt: schema.rooms.createdAt,
        ownedByUser: sql`CASE WHEN ${schema.rooms.createdBy} = ${userId} THEN TRUE ELSE FALSE END`,
    })
        .from(schema.rooms)
        .leftJoin(schema.questions, eq(schema.questions.roomId, schema.rooms.id))
        .groupBy(
            schema.rooms.id,
            schema.rooms.name,
            schema.rooms.description,
            schema.rooms.createdAt
        )
        .orderBy(schema.rooms.createdAt)

    return rooms
}

export const GetRoomService = async (userId, roomId) => {
  const [room] = await db
    .select({
      id: schema.rooms.id,
      name: schema.rooms.name,
      description: schema.rooms.description,
      questionsCount: count(schema.questions.id),
      createdAt: schema.rooms.createdAt,
      ownedByUser: sql`
        CASE 
          WHEN ${schema.rooms.createdBy} = ${userId} 
          THEN TRUE 
          ELSE FALSE 
        END
      `,
    })
    .from(schema.rooms)
    .leftJoin(schema.questions, eq(schema.questions.roomId, schema.rooms.id))
    .where(eq(schema.rooms.id, roomId))
    .groupBy(
      schema.rooms.id,
      schema.rooms.name,
      schema.rooms.description,
      schema.rooms.createdAt,
      schema.rooms.createdBy
    )

  if (!room) return null

  const texts = await db
    .select({
      id: schema.roomTexts.id,
      transcript: schema.roomTexts.transcript,
      embeddings: schema.roomTexts.embeddings,
      createdAt: schema.roomTexts.createdAt,
    })
    .from(schema.roomTexts)
    .where(eq(schema.roomTexts.roomId, roomId))
    .orderBy(schema.roomTexts.createdAt)

  return {
    ...room,
    roomTexts: texts
  }
}

export function cosineSimilarity(a, b) {
    let dot = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dot += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export const CreateQuestionService = async (roomId, question) => {
    const questionEmbedding = await generateEmbeddings(question);

    const texts = await db
        .select({
            id: schema.roomTexts.id,
            transcript: schema.roomTexts.transcript,
            embeddings: schema.roomTexts.embeddings,
        })
        .from(schema.roomTexts)
        .where(eq(schema.roomTexts.roomId, roomId));

    const rankedTexts = texts
        .map(text => ({
            ...text,
            similarity: cosineSimilarity(
                questionEmbedding,
                text.embeddings
            ),
        }))
        .filter(text => text.similarity > 0.7)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 6);

    let answer = null;

    if (rankedTexts.length > 0) {
        const transcriptions = rankedTexts.map(t => t.transcript);
        answer = await generateAnswer(question, transcriptions);
    }

    const newQuestion = await db
        .insert(schema.questions)
        .values({
            question,
            roomId,
            answer,
        })
        .returning();

    if (!newQuestion[0]) {
        throw new Error('Falha ao criar nova pergunta');
    }

    return newQuestion[0];
};

export const GetRoomQuestionsService = async (roomId) => {
    const questions = await db.select().from(schema.questions).where(
        eq(schema.questions.roomId, roomId)
    ).orderBy(schema.questions.createdAt)
    return questions;
}

export const UploadAudioForRoomService = async (roomId, audio) => {
    const audioBuffer = audio.buffer;
    const audioBase64 = audioBuffer.toString('base64')
    const transcription = await transcribeAudio(audioBase64, audio.mimetype)
    const embeddings = await generateEmbeddings(transcription)

    const result = await db.insert(schema.roomTexts).values({
        roomId,
        transcript: transcription,
        embeddings: embeddings
    }).returning();

    const chunk = result[0];
    if (!chunk) {
        throw new Error("Erro ao salvar no banco")
    }

    return {
        transcription,
        embeddings
    }
}

export const UploadTextForRoomService = async (roomId, text) => {
    const embeddings = await generateEmbeddings(text)
    const result = await db.insert(schema.roomTexts).values({
        roomId,
        transcript: text,
        embeddings: embeddings
    }).returning();

    const chunk = result[0];
    if (!chunk) {
        throw new Error("Erro ao salvar no banco")
    }
}