import request from 'supertest';
import app from '../../../../server.js';
import bcrypt from 'bcryptjs';
import User from '../../../models/usersModels.js';

let token;

beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("123", 10);
    await User.destroy({ where: { email: "saralamari9@teste.com" } });
    await User.create({
        email: "saralamari9@teste.com",
        password: hashedPassword
    });

    const res = await request(app)
        .put('/users/signin')
        .send({ email: 'saralamari9@teste.com', password: '123' });
    token = res.body.token;
});

afterAll(async () => {
    await User.destroy({ where: { email: 'saralamari9@teste.com' } });
});

describe('Teste da conversão de braille para textp', ()=> {
    it('Deve retornar o texto corretamente', async() => {
        res = await request(app)
        .post('/tts/brailleToText')
        .set(`Authorization`,  `Bearer ${token}`)
        .send({braille: "⠠⠞⠑⠎⠞⠑⠒⠀⠠⠕⠇⠷⠂⠀⠍⠥⠝⠙⠕⠖⠀⠼⠁⠃⠉"})

        expect(res.status).toBe(200)
        expect(res.body.result).toBe('Teste: Olá, mundo! 123')
    })

    it('Deve retornar caractere inválido', async () =>{
        res = await request(app)
        .post('/tts/brailleToText')
        .set('Authorization', `Bearer ${token}`)
        .send({braille: 'teste invalido ⠞' })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Caractere inválido')
    })
})