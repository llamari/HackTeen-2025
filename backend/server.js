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
    await sequelize.sync();
    console.log('Banco sincronizado com sucesso!');
  } catch (error) {
    console.error('Erro ao sincronizar o banco:', error);
  }
})();

app.use('/users', usersRoutes);

app.use('/tts', ttsRoutes);

export default app;