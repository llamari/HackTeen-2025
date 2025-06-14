import fs from 'fs';
import { SummariseService, TextToSoundService, YourTextsService } from '../services/ttsServices.js';

export const TextToSound = async (req, res) => {
  const userId = req.user.id;
  const { text, language } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Texto não fornecido.' });
  }

  if (!language) {
    return res.status(400).json({ error: 'Idioma não fornecido.' });
  }

  try {
    const filepath = await TextToSoundService(userId, text, language);

    res.download(filepath, (err) => {
      if (err) {
        console.error('Erro ao enviar arquivo:', err);
      }
      fs.unlink(filepath, (unlinkErr) => {
        if (unlinkErr) {
          console.error('Erro ao apagar arquivo:', unlinkErr);
        }
      });
    });
  } catch (error) {
    console.error('Erro:', error);
    if (error.type === 'db') {
      return res.status(400).json({ error: error.message });
    }
    if (error.type === 'audio') {
      return res.status(500).json({ error: error.message });
    }
    return res.status(500).json({ error: 'Erro inesperado.' });
  }
};


export const Summarise = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Valid text not provided.' });
    }

    const summary = await SummariseService(userId, text);

    return res.status(200).json({ summary });
  } catch (error) {
    console.error('Summarization error:', error);
    return res.status(500).json({
      error: 'Error during summarization'
    });
  }
};

export const YourTexts = async (req, res) => {
  const userId = req.user.id;
  const texts = await YourTextsService(userId);

  res.json(texts);
}