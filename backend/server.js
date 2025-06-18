import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
const app = express();
const port = 5000;

import usersRoutes from './src/routes/usersRoutes.js';
import ttsRoutes from './src/routes/ttsRoutes.js';
import SwaggerImport from '../docs/swagger.json' with {type: 'json'}
import { sequelize } from './src/database/database.js';
import Usuario from './src/models/usersModels.js';
import Text from './src/models/ttsModels.js';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerImport));

const allowedOrigins = ['http://localhost:3000', 'http://localhost:8081'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Banco sincronizado com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar o banco:', error);
  }
})();

app.use('/users', usersRoutes);

app.use('/tts', ttsRoutes);

//----------------------------------------------------------------------------

import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

// 🔑 Sua API Key
const API_KEY = process.env.API_KEY

// 📤 URL da API do Gemini
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// 🧠 Defina o prompt e a imagem
const requestBody = {
  contents: [
    {
      parts: [
        { text: "O que é um beija-flor?" }
      ],
    },
  ],
};

app.get('/', async (req, res) => {
  try {
    const response = await axios.post(API_URL, requestBody);

    console.log('Resposta do modelo:\n');
    response.data.candidates.forEach((candidate, index) => {
      console.log(`${candidate.content.parts[0].text}\n`);
    });
  } catch (error) {
    console.error('Erro ao chamar a API:', error.response ? error.response.data : error.message);
  }
})

export default app;
