import path from 'path';
import gTTS from 'gtts';
import Text from '../models/ttsModels.js';
import { fileURLToPath } from 'url';
import axios from 'axios';
import SummarizerManager from 'node-summarizer/src/SummarizerManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TextToSoundService = async (userId, text, language) => {
    const filename = `audio-${Date.now()}.mp3`;
    const filepath = path.join(__dirname, filename);

    try {
        await Text.create({
            content: text,
            user_id: userId
        });
    } catch (error) {
        throw { type: 'db', message: 'Erro ao salvar texto no banco.' };
    }

    return new Promise((resolve, reject) => {
        const gtts = new gTTS(text, language);

        gtts.save(filepath, (err) => {
            if (err) {
                reject({ type: 'audio', message: 'Erro ao gerar áudio.' });
            } else {
                resolve(filepath);
            }
        });
    });
};

export const SummariseService = async (text) => {
    try {
        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: `Resuma o seguinte texto: \n${text}` }
                    ],
                },
            ],
        };

        const API_KEY = process.env.API_KEY;
        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await axios.post(API_URL, requestBody);

        const result = response.data.candidates[0]?.content?.parts[0]?.text || '';

        return result;
    } catch (error) {
        console.error('Erro ao chamar a API:', error.response ? error.response.data : error.message);
        return '';
    }
};

export const YourTextsService = async (userId) => {
    const texts = await Text.findAll({ where: { user_id: userId } })
    return texts
}