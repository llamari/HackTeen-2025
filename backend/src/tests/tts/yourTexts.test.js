import request from 'supertest';
import app from '../../../server.js';
import bcrypt from 'bcryptjs';
import User from '../../models/usersModels.js';
import Text from '../../models/ttsModels.js';

let token;

beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("123", 10);
    await User.destroy({ where: { email: "saralamari6@teste.com" } });
    await User.create({
        email: "saralamari6@teste.com",
        password: hashedPassword
    });

    const user = await User.findOne({where: {email: 'saralamari6@teste.com'}})

    const res = await request(app)
        .put('/users/signin')
        .send({ email: 'saralamari6@teste.com', senha: '123' });

    await Text.create({
        content: "Olá mundo! Esse é um teste.",
        user_id: user.id
    });

    token = res.body.token;
});

afterAll(async () => {
    await User.destroy({ where: { email: 'saralamari6@teste.com' } });
});

describe('Teste do endpoint /tts/yourtexts', () => {
    it('Deve retornar um resumo do texto', async () => {
        const res = await request(app)
            .get('/tts/yourtexts')
            .set('Authorization', `Bearer ${token}`)

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('texts');
    });
});
