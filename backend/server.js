import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
const app = express();
const port = 5000;

import usersRoutes from './src/routes/usersRoutes.js';
import ttsRoutes from './src/routes/ttsRoutes.js';
import SwaggerImport from '../docs/swagger.json' with {type: 'json'}
import { sequelizeDatabase } from './src/database/database.js';
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

await sequelizeDatabase();

await Usuario.sync({ alter: true }); 
await Text.sync({ alter: true });

app.use('/users', usersRoutes);

app.use('/tts', ttsRoutes);

app.listen(port, (req, res) => {
  console.log(`Ouvindo na porta http://localhost:${port}`);
})