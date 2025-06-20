import express from 'express';
import verifyToken from '../middlewares/jwt_middleware.js'
import { TextToSound, Summarise, YourTexts, Braille, BrailleToText } from '../controllers/tts.js';
const router = express.Router();

router.post('/', verifyToken, TextToSound);

router.post('/summarize', Summarise);

router.get('/yourtexts', verifyToken, YourTexts);

router.post('/textToBraille', verifyToken, Braille);

router.post('/brailleToText', verifyToken, BrailleToText);

export default router;