import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import multer from 'multer';
const app = express();

import usersRoutes from './src/routes/usersRoutes.js';
import ttsRoutes from './src/routes/ttsRoutes.js';
import roomsRoutes from './src/routes/roomRoutes.js';
import SwaggerImport from './swagger.json' with {type: 'json'}
import { } from './src/database/connection.js';

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerImport));

const allowedOrigins = ['http://localhost:3000', 'http://localhost:8081', 'https://hack-teen-2025.vercel.app'];

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

const upload = multer({ storage: multer.memoryStorage() });

app.get('/', (req, res) => res.send("API do Inclusound rodando!"))

app.use('/users', usersRoutes);

app.use('/tts', ttsRoutes);

app.use('/rooms', (req, res, next) => {
  if (req.path.includes('/audio')) {
    upload.single('file')(req, res, next);
  } else {
    next();
  }
}, roomsRoutes);

export default app;