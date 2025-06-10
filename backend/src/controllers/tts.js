const express = require('express');
const fs = require('fs');
const path = require('path');
const gTTS = require('gtts');
const db = require('../database/db');
const SummarizerManager = require('node-summarizer').SummarizerManager; 

const app = express();
app.use(express.json());

const TextToSound = async (req, res) => {
  const userId = req.user.id; //Pega o id do usuário vindo do verifyToken
  console.log(userId)
  const { text, language } = req.body; //Pega do body

  if (!text) { //erro para se não tiver texto
    return res.status(400).json({ error: 'Texto não fornecido.' });
  }

  const filename = 'audio-${Date.now()}.mp3'; //nome do arquivo
  const filepath = path.join(__dirname, filename); //Onde vai ficar o arquivo
  const gtts = new gTTS(text, language); //o som em si!

  db.run(`INSERT INTO texts (content, user_id) VALUES (?, ?)`, [text, userId], function (err) { //inserção no banco de dados
    if (err) return res.status(400).json({ error: err.message });
  });

  gtts.save(filepath, (err) => { //salva o som no local indicado
    if (err) {
      return res.status(500).json({ error: 'Erro ao gerar áudio.' });
    }

    res.download(filepath, (err) => { //retorna um download desse arquivo
      fs.unlinkSync(filepath); //deleta arquivo
    });
  });
};

const Summarise = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;
    console.log("Entrou para resumir")
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Valid text not provided.' });
    }

    const targetLength = Math.floor(text.length * 0.6);

    const sentenceCount = Math.max(1, Math.floor(targetLength / 100));

    const summarizer = new SummarizerManager(text, sentenceCount);
    const summary = summarizer.getSummaryByFrequency().summary;

    db.run(
      `INSERT INTO texts (content, user_id) VALUES (?, ?)`,
      [text, userId]
    );

    return res.status(200).json({ summary });

  } catch (error) {
    console.error('Summarization error:', error);
    return res.status(500).json({
      error: 'Error during summarization'
    });
  }
};

const YourTexts = async (req, res) => {
  const userId = req.user.id;
  db.all(`SELECT * FROM texts WHERE user_id=?`, [userId], (err, rows) => {
    console.log("Histórico: ", rows);
    res.json(rows);
  });
}

module.exports = { TextToSound, Summarise, YourTexts }
