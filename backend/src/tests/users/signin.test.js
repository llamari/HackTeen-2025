import request from 'supertest';
import app from '../../../server.js';
import User from '../../models/usersModels.js';
import bcrypt from 'bcryptjs';

beforeAll(async () => {
  await User.destroy({ where: { email: "saralamari3@gmail.com" } })

  const hashedPassword = await bcrypt.hash("123", 10);

  await User.create({
    email: "saralamari3@gmail.com",
    password: hashedPassword
  });
})

afterAll(async () => {
  await User.destroy({ where: { email: "saralamari3@gmail.com" } })
})

describe('Testando rota PUT /users/signin', () => {
  it('Deve fazer login de um usuário válido', async () => {
    const res = await request(app)
      .put('/users/signin')
      .send({ email: "saralamari3@gmail.com", password: "123" }); 

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body).toHaveProperty('token');
    expect(res.body.message).toBe('Login realizado com sucesso');
  });

  it('Deve retornar erro se a senha estiver incorreta', async () => {
    const res = await request(app)
      .put('/users/signin')
      .send({ email: "saralamari3@gmail.com", password: "senhaerrada" }); 

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Erro de autenticação');
    expect(res.body).toHaveProperty('error');
  });

  it('Deve retornar erro se faltar parâmetros', async () => {
    const res = await request(app)
      .put('/users/signin')
      .send({ email: "saralamari3@gmail.com" }); // Sem senha

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Email e senha são obrigatórios');
  });

});
