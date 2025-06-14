import path from 'path';
import gTTS from 'gtts';
import Text from '../models/ttsModels.js';
import { fileURLToPath } from 'url';
import SummarizerManager from 'node-summarizer/src/SummarizerManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TextToSoundService = async (userId, text, language) => {
    const filename = `audio-${Date.now()}.mp3`;
    const filepath = path.join(__dirname, '../audios', filename);

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

export const SummariseService = async (userId, text) => {
    const targetLength = Math.floor(text.length * 0.6);

    const sentenceCount = Math.max(1, Math.floor(targetLength / 100));

    const summarizer = new SummarizerManager(text, sentenceCount);
    const summary = summarizer.getSummaryByFrequency().summary;

    try {
        await Text.create({
            content: text,
            user_id: userId
        })
    } catch (error) {
        throw { type: 'db', message: 'Erro ao salvar texto no banco.' };
    }

    return summary;
};

export const YourTextsService = async (userId) => {
  const texts = await Text.findAll({where: {user_id: userId}})
  return texts
}