import fs from 'fs';
import { BrailleForDisplayService, BrailleService, BrailleToTextService, SummariseService, TextToSoundService, YourTextsService } from '../services/ttsServices.js';

import dotenv from 'dotenv';
dotenv.config();

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
    const { text } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Informação essencial faltando' });
    }

    const summary = await SummariseService(text);

    return res.status(200).json({ summary });
  } catch (error) {
    console.error('Erro no resumo:', error);
    return res.status(500).json({
      error: 'Erro durante o resumo'
    });
  }
};

export const YourTexts = async (req, res) => {
  const userId = req.user.id;
  const texts = await YourTextsService(userId);

  res.json({ texts: texts });
}

export const Braille = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;
    const result = await BrailleService(text, userId);
    res.send({ result: result });
  } catch (error) {
    if (error.type == "invalid") {
      return res.status(400).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Erro inesperado.' });
  }
}

export const BrailleToText = async (req, res) => {
  try {
    const userId = req.user.id;
    const { braille } = req.body;
    const result = await BrailleToTextService(braille, userId);
    res.send({ result: result });
  } catch (error) {
    if (error.type == "invalid") {
      return res.status(400).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Erro inesperado.' });
  }
}

export const BrailleForDisplay = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;
    const result = await BrailleForDisplayService(text, userId);
    res.send({ result: result })
  } catch (error) {
    if (error.type == "invalid") {
      return res.status(400).json({ error: error.message })
    }
    return res.status(500).json({ error: 'Erro inesperado.' });
  }
}