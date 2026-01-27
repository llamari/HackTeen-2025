
import { CreateQuestionService, CreateRoomService, GetRoomQuestionsService, GetRoomService, GetRoomsService, UploadAudioForRoomService, UploadTextForRoomService } from '../services/roomServices.js';
import dotenv from 'dotenv';

dotenv.config();

export const CreateRoom = async (req, res) => {
    const userId = req.user.id;
    const { name, description } = req.body

    if (!name) {
        return res.status(400).json({ error: 'Nome da sala é obrigatório' });
    }
    try {
        const newRoom = await CreateRoomService(name, description, userId);

        if (!newRoom) {
            return res.status(500).json({ error: 'Falha ao criar nova sala' });
        }

        res.status(201).json(newRoom);
    } catch (error) {
        return res.status(500).json({
            error: 'Erro inesperado'
        });
    }
}

export const GetRooms = async (req, res) => {
    try {
        const rooms = await GetRoomsService(req.user.id);
        res.status(200).json(rooms);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'Erro inesperado'
        });
    }
}

export const GetRoom = async (req, res) => {
    try {
        const room = await GetRoomService(req.user.id, req.params.roomId);
        res.status(200).json(room);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'Erro inesperado'
        });
    }
}

export const CreateQuestion = async (req, res) => {
    const { roomId } = req.params;
    const { question } = req.body;

    try {
        const newQuestion = await CreateQuestionService(roomId, question);
        res.status(201).json(newQuestion);
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'Erro inesperado'
        });
    }
}

export const GetRoomQuestions = async (req, res) => {
    const { roomId } = req.params;

    try {
        const questions = await GetRoomQuestionsService(roomId);
        res.status(200).json(questions);
    } catch (error) {
        return res.status(500).json({
            error: 'Erro inesperado'
        })
    }
}

export const UploadAudioForRoom = async (req, res) => {
    const { roomId } = req.params;
    const audio = req.file;

    if (!audio) {
        return res.status(400).json({ error: 'O áudio não foi enviado' });
    }

    try {
        const result = await UploadAudioForRoomService(roomId, audio);
        res.status(200).json({ 
            message: 'Áudio enviado com sucesso',
            transcription: result.transcription,
            embeddings: result.embeddings
        });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            error: 'Erro inesperado'
        });
    }
}

export const UploadTextForRoom = async (req, res) => {
    const { roomId } = req.params;
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ error: 'O texto é obrigatório' });
    }

    try {
        await UploadTextForRoomService(roomId, text);
        res.status(200).json({ message: 'Texto enviado com sucesso' });
    } catch (error) {
        return res.status(500).json({
            error: 'Erro inesperado'
        });
    }
}