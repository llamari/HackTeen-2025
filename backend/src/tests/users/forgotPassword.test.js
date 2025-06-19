// test/forgotPassword.test.js (ou onde estiver)
import request from 'supertest';
import app from '../../../server.js';
import { expect, jest } from '@jest/globals';
import Usuario from '../../models/usersModels.js';
import bcrypt from 'bcryptjs';

let code;

// Mock do módulo que envia e-mail
jest.unstable_mockModule('../../utils/sendEmail.js', () => ({
    sendEmailWithPassword: jest.fn(() => Promise.resolve()),
}));

let token;

beforeAll(async () => {
    await Usuario.destroy({ where: { email: "saralamarisilva@gmail.com" } })

    const hashedPassword = await bcrypt.hash("123", 10);

    await Usuario.create({
        email: "saralamarisilva@gmail.com",
        password: hashedPassword
    });
});

afterAll(async () => {
    await Usuario.destroy({ where: { email: "saralamarisilva@gmail.com" } })
})

describe('Teste do forgot password', () => {
    it('Deve responder com código e não enviar e-mail real', async () => {
        const res = await request(app)
            .put('/users/forgot/password')
            .send({ email: 'saralamarisilva@gmail.com' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch('E-mail enviado');
        expect(res.body).toHaveProperty('code');

        code = res.body.code;
    });

    it('Deve verificar se o código está correto', async () => {
        const res = await request(app)
            .put('/users/verify/code')
            .send({ email: 'saralamarisilva@gmail.com', code: code });

        expect(res.status).toBe(202);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch('Usuário verificado');
        expect(res.body.success).toBe(true);
    });

    it('Deve mudar a senha do usuário', async () => {
        const res = await request(app)
            .put('/users/new/password')
            .send({ email: 'saralamarisilva@gmail.com', senha: '1234' });

        expect(res.status).toBe(202);
        expect(res.body).toHaveProperty('message');
        expect(res.body.message).toMatch('Senha mudada');
        expect(res.body.success).toBe(true);
    });
});
