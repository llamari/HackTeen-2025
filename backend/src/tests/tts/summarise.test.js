import request from 'supertest';
import app from '../../../server.js';
import bcrypt from 'bcryptjs';
import Usuario from '../../models/usersModels.js';

let token;

beforeAll(async () => {
    const hashedPassword = await bcrypt.hash("123", 10);
    await Usuario.destroy({ where: { email: "saralamari5@teste.com" } });
    await Usuario.create({
        email: "saralamari5@teste.com",
        password: hashedPassword
    });

    const res = await request(app)
        .put('/users/signin')
        .send({ email: 'saralamari5@teste.com', senha: '123' });
    token = res.body.token;
});

afterAll(async () => {
    await Usuario.destroy({ where: { email: 'saralamari5@teste.com' } });
});

describe('Teste do endpoint /tts/summarize', () => {
    it('Deve retornar um resumo do texto', async () => {
        const res = await request(app)
            .post('/tts/summarize')
            .set('Authorization', `Bearer ${token}`)
            .send({ text: "Inclusão é mais do que aceitar, é abraçar. É entender que cada pessoa carrega uma história, um jeito único de existir, de sentir e de aprender. É quando enxergamos além das diferenças e percebemos que, no fundo, todos só querem pertencer, ser ouvidos e respeitados. Quando olhamos nos olhos do outro e dizemos: 'Você importa, exatamente como é', construímos um mundo mais justo. Um mundo onde ninguém fica para trás, onde diversidade não é obstáculo, mas ponte. Porque cada voz tem valor, cada sonho merece espaço, e cada passo dado junto faz a caminhada mais bonita. Ser inclusivo não é favor, é amor em ação. É humanidade na sua forma mais pura e necessária."});

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('summary');
    }, 15000);

    it('Deve retornar 400 se o texto não for uma string', async () => {
        const res = await request(app)
            .post('/tts/summarize')
            .set('Authorization', `Bearer ${token}`)
            .send({text: 123})

        expect(res.status).toBe(400);
        expect(res.body.error).toBe('Informação essencial faltando');
    });
});
