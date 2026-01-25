import { GoogleGenAI } from "@google/genai";

const gemini = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

const model = 'gemini-3-flash-preview'

export async function transcribeAudio(audio, mimeType) {
    const response = await gemini.models.generateContent({
        model,
        contents: [{
            text: "Transcreva o áudio. Seja preciso e natural com a pontuação adequada e dividindo em parágrafos quando necessário.",
        },
        {
            inlineData: {
                mimeType,
                data: audio
            }
        }]
    })

    if (!response.text) {
        throw new Error('Erro na transcrição')
    }

    return response.text
}

export async function generateEmbeddings(text) {
    const response = await gemini.models.embedContent({
        model: 'text-embedding-004',
        contents: [{ text }],
        config: {
            taskType: 'RETRIEVAL_DOCUMENT',
        }
    })

    if (!response.embeddings?.[0].values) {
        throw new Error('Não foi possível criar os embeddings')
    }

    return response.embeddings[0].values
}

export async function generateAnswer(question, transcriptions) {
    const context = transcriptions.join('\n \n');

    const prompt = `
        Com base nos textos fornecidos abaixo, responda a pergunta a seguir de forma clara e precisa. Responda no idioma da pergunta.
        Textos: ${context}. \n
        Pergunta: ${question}\n
        INSTRUÇÕES:
        - Use apenas informações contidas no texto enviado;
        - Se a resposta não for encontrada nos textos, apenas diga que não há informações suficientes para responder;
        - Seja objetivo;
        - Tenha um tom educativo e profissional;
        - Se apropriado, cite trechos dos textos;
    `.trim()

    const response = await gemini.models.generateContent({
        model,
        contents: [
            {
                text: prompt
            }
        ]
    })

    if (!response.text) {
        throw new Error('Erro ao gerar resposta');
    }

    return response.text
}

export async function summarizeText(text) {
    const prompt = `
        Resuma o seguinte texto de forma clara e objetiva, mantendo os pontos principais e a coerência do conteúdo. O resumo deve ser conciso e informativo, além de ser no mesmo idioma que o texto.
        Texto: ${text}
    `.trim();

    const response = await gemini.models.generateContent({
        model,
        contents: [
            {
                text: prompt
            }
        ]
    })

    if (!response.text) {
        throw new Error('Erro ao gerar resposta');
    }

    return response.text
}

export async function describeImage(imageBase64) {
    const prompt = `
        Descreva a imagem fornecida de forma detalhada e precisa, destacando os elementos visuais mais importantes e relevantes. A descrição deve ser clara e informativa, permitindo que alguém que não possa ver a imagem compreenda seu conteúdo.
    `.trim();

    const response = await gemini.models.generateContent({
        model,
        contents: [
            {
                parts: [
                    {
                        inlineData: {
                            mimeType: "image/jpeg",
                            data: imageBase64
                        }
                    },
                    {
                        text: prompt
                    }
                ]
            }
        ]
    })
    if (!response.text) {
        throw new Error('Erro ao gerar resposta');
    }

    return response.text
}
