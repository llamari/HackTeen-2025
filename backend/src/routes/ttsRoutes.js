import express from 'express';
import verifyToken from '../middlewares/jwt_middleware.js'
import { TextToSound, Summarise, YourTexts, Braille, BrailleToText, BrailleForDisplay } from '../controllers/tts.js';
const router = express.Router();

router.post('/', verifyToken, TextToSound);

router.post('/summarize', Summarise);

router.get('/yourtexts', verifyToken, YourTexts);

router.post('/textToBraille', verifyToken, Braille);

router.post('/brailleToText', verifyToken, BrailleToText);

router.post('/brailleDisplay', verifyToken, BrailleForDisplay);

export default router;