import request from 'supertest';
import app from '../../../server.js';
import Usuario from '../../models/usersModels.js';

beforeAll(async() => {
    await Usuario.destroy({where: {email: 'sara.silva591@etec.sp.gov.br'}})
});

afterAll(async() => {
    await Usuario.destroy({where: {email: 'sara.silva591@etec.sp.gov.br'}})
});

describe('Testando rota POST /users/signup', () => {
  it('Deve cadastrar um novo usuário', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send({ email: "sara.silva591@etec.sp.gov.br", senha: "123" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Usuário criado");
  });

  it('Deve retornar erro já que o usuário já está cadastrado', async () => {
    const res = await request(app)
      .post('/users/signup')
      .send({ email: "sara.silva591@etec.sp.gov.br", senha: "123" });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe("Usuário já existe");
  });
});
