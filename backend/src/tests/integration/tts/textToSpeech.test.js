import request from 'supertest';
import { jest } from '@jest/globals';
import app from '../../../../server.js';
import path from 'path';
import fs from 'fs';
import { TextToSoundService } from '../../../services/ttsServices.js';
import bcrypt from 'bcryptjs';
import User from '../../../models/usersModels.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mockTextToSoundService = jest.fn();
jest.unstable_mockModule('../../../services/ttsServices.js', () => ({
    TextToSoundService: mockTextToSoundService
}));

let token;

beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("123", 10);
    await User.destroy({ where: { email: "saralamari4@teste.com" } });
    await User.create({
        email: "saralamari4@teste.com",
        password: hashedPassword
    });

    const res = await request(app)
        .put('/users/signin')
        .send({ email: 'saralamari4@teste.com', password: '123' });
    token = res.body.token;
});

afterEach(() => {
    jest.clearAllMocks();
    const fakeFile = path.join(__dirname, 'fakefile.mp3');
    if (fs.existsSync(fakeFile)) {
        fs.unlinkSync(fakeFile);
    }
});

afterAll(async () => {
    const files = fs.readdirSync(__dirname);
    files.forEach(file => {
        if (file.endsWith('.mp3')) {
            fs.unlinkSync(path.join(__dirname, file));
        }
    });

    await User.destroy({ where: { email: 'saralamari4@teste.com' } });
});

describe('Teste do endpoint /tts', () => {
    it('Deve retornar um arquivo para download', async () => {
        mockTextToSoundService.mockImplementation(() => {
            const fakeFile = path.join(__dirname, 'fakefile.mp3');
            fs.writeFileSync(fakeFile, 'fake audio content');
            return Promise.resolve(fakeFile);
        });

        const res = await request(app)
            .post('/tts')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Hello World', language: 'en' });

        expect(res.status).toBe(200);
        expect(res.header['content-disposition']).toMatch(/attachment/);
        expect(res.header['content-type']).toMatch(/audio\/mpeg/);
        expect(res.body).toBeInstanceOf(Buffer);
        expect(res.body.length).toBeGreaterThan(0);
    }, 60000);

    it('Deve retornar 400 se não enviar texto', async () => {
        const res = await request(app)
            .post('/tts')
            .set('Authorization', `Bearer ${token}`)
            .send({ language: 'en' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Texto não fornecido.');
    });

    it('Deve retornar 400 se não enviar idioma', async () => {
        const res = await request(app)
            .post('/tts')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: 'Hello World' });

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Idioma não fornecido.');
    });

});
