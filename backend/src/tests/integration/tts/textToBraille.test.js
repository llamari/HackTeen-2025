import request from 'supertest';
import app from '../../../../server.js';
import bcrypt from 'bcryptjs';
import User from '../../../models/usersModels.js';

let token;

beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("123", 10);
    await User.destroy({ where: { email: "saralamari8@teste.com" } });
    await User.create({
        email: "saralamari8@teste.com",
        password: hashedPassword
    });

    const res = await request(app)
        .put('/users/signin')
        .send({ email: 'saralamari8@teste.com', password: '123' });
    token = res.body.token;
});

afterAll(async () => {
    await User.destroy({ where: { email: 'saralamari8@teste.com' } });
});

describe('Teste da conversão de texto para braille', ()=> {
    it('Deve retornar um código em braille corretamente', async() => {
        res = await request(app)
        .post('/tts/textToBraille')
        .set(`Authorization`,  `Bearer ${token}`)
        .send({text: "Teste: Olá, mundo! 123"})

        expect(res.status).toBe(200)
        expect(res.body.result).toBe('⠠⠞⠑⠎⠞⠑⠒⠀⠠⠕⠇⠷⠂⠀⠍⠥⠝⠙⠕⠖⠀⠼⠁⠃⠉')
    })

    it('Deve retornar caractere inválido', async () =>{
        res = await request(app)
        .post('/tts/textToBraille')
        .set('Authorization', `Bearer ${token}`)
        .send({text: 'teste invalido ⠞' })

        expect(res.status).toBe(400)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe('Caractere inválido')
    })
})