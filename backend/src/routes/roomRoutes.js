import express from 'express';
import verifyToken from '../middlewares/jwt_middleware.js'
import { CreateQuestion, CreateRoom, GetRoom, GetRoomQuestions, GetRooms, UploadAudioForRoom, UploadTextForRoom } from '../controllers/roomControllers.js';
const router = express.Router();

router.post('/', verifyToken, CreateRoom);
router.get('/', verifyToken, GetRooms);
router.get('/:roomId', verifyToken, GetRoom);
router.post('/questions/:roomId', verifyToken, CreateQuestion);
router.get('/questions/:roomId', verifyToken, GetRoomQuestions);
router.post('/:roomId/audio', verifyToken, UploadAudioForRoom);
router.post('/:roomId/text', verifyToken, UploadTextForRoom); 

export default router;