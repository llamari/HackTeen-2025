import express from 'express';
import verifyToken from '../middlewares/jwt_middleware.js'
import { TextToSound, Summarise, YourTexts } from '../controllers/tts.js';
const router = express.Router();

router.post('/', verifyToken, TextToSound);

router.post('/summarize', Summarise);

router.get('/yourtexts', verifyToken, YourTexts);

export default router;