import express from 'express';
import verifyToken from '../middlewares/jwt_middleware.js'
import { TextToSound, Summarise, YourTexts, Braille, BrailleToText, BrailleForDisplay, DescribeImage } from '../controllers/ttsControllers.js';
const router = express.Router();

router.post('/', verifyToken, TextToSound);
router.post('/summarize', verifyToken, Summarise);
router.get('/yourtexts', verifyToken, YourTexts);
router.post('/textToBraille', verifyToken, Braille);
router.post('/brailleToText', verifyToken, BrailleToText);
router.post('/brailleDisplay', verifyToken, BrailleForDisplay);
router.post('/describeImage', verifyToken, DescribeImage);

export default router;