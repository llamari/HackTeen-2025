import request from 'supertest';
import app from '../../../server.js';
import User from '../../models/usersModels.js';
import bcrypt from 'bcryptjs';

let token;

beforeAll(async () => {
    await User.destroy({ where: { email: "saralamari@teste.com" } })

    const hashedPassword = await bcrypt.hash("123", 10);

    await User.create({
        email: "saralamari@teste.com",
        password: hashedPassword
    });

    await User.destroy({ where: { email: "saralamari2@teste.com" } })


    await User.create({
        email: "saralamari2@teste.com",
        password: hashedPassword
    });

    const res = await request(app)
        .put('/users/signin')
        .send({ email: 'saralamari2@teste.com', senha: '123' });

    token = res.body.token;
});

afterAll(async () => {
    await User.destroy({ where: { email: "saralamari2@teste.com" } })
})

describe('Deleta um usuário', () => {
    it('Deve deletar um usuário válido', async () => {
        const res = await request(app)
            .delete('/users/delete')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: "saralamari@teste.com" })

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message');
        expect(res.body.success).toBe(true);
    })
});