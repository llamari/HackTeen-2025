import request from 'supertest';
import app from '../../../../server.js';
import bcrypt from 'bcryptjs';
import User from '../../../models/usersModels.js';

let token;

beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("123", 10);
    await User.destroy({ where: { email: "saralamari10@teste.com" } });
    await User.create({
        email: "saralamari10@teste.com",
        password: hashedPassword
    });

    const res = await request(app)
        .put('/users/signin')
        .send({ email: 'saralamari10@teste.com', password: '123' });
    token = res.body.token;
});

afterAll(async () => {
    await User.destroy({ where: { email: 'saralamari10@teste.com' } });
});

describe('Teste da conversão de texto para um json com os pontos corretos para formar o texto em braille em um display', ()=> {
    it('Deve retornar um json corretamente', async() => {
        res = await request(app)
        .post('/tts/brailleDisplay')
        .set(`Authorization`,  `Bearer ${token}`)
        .send({text: "Teste! 123"})

        expect(res.status).toBe(200)
        expect(res.body.result).toBe('{{0, 0, 0, 0, 0, 1},{0, 1, 1, 1, 1, 0},{1, 0, 0, 1, 0, 0},{0, 1, 1, 0, 1, 0},{0, 1, 1, 1, 1, 0},{1, 0, 0, 1, 0, 0},{0, 0, 1, 1, 1, 0},{0, 0, 0, 0, 0, 0},{0, 1, 0, 1, 1, 1},{1, 0, 0, 0, 0, 0},{1, 0, 1, 0, 0, 0},{1, 1, 0, 0, 0, 0},};')
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