import { jest } from '@jest/globals';

//"mockar" antes de tudo
jest.unstable_mockModule('../../services/usersServices.js', () => ({
    GetUsersService: jest.fn(),
    SignInService: jest.fn(),
    SignUpService: jest.fn(),
    DeleteUserService: jest.fn(),
    ForgotPasswordService: jest.fn(),
    VerifyCodeService: jest.fn(),
    NewPasswordService: jest.fn(),
}));



let GetUsers, SignIn, SignUp, Delete, ForgotPassword, Verify, NewPassword //Declaração das variaveis
let usersServices;

describe('Testes do Users', () => {
    const mockRequest = (body = {}, user = {}) => ({ body, user }); //Requisição

    const mockResponse = () => { //Resposta
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        return res;
    };

    beforeEach(async () => {
        const controller = await import('../../controllers/usersControllers.js'); //Atribuição dos valores das variaveis
        GetUsers = controller.GetUsers;
        SignIn = controller.SignIn;
        SignUp = controller.SignUp; 
        Delete = controller.Delete;
        ForgotPassword = controller.ForgotPassword;
        Verify = controller.Verify;
        NewPassword = controller.NewPassword;

        usersServices = await import('../../services/usersServices.js');
    });

    afterEach(() => {
        jest.resetAllMocks(); //Reinicializar depois de cada um
    });

    //GetUsers
    test('GetUsers deve retornar a lista de usuários', async () => {
        const req = mockRequest();
        const res = mockResponse();
        const users = [{ id: 1, email: 'test@example.com' }];

        usersServices.GetUsersService.mockResolvedValue(users);

        await GetUsers(req, res);

        expect(res.json).toHaveBeenCalledWith(users);
    }); //Sucesso

    //SignIn
    test('SignIn deve retornar 400 se email ou senha não forem fornecidos', async () => {
        const req = mockRequest({ email: 'test@example.com' });
        const res = mockResponse();

        await SignIn(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Email e senha são obrigatórios', success: false });
    }); //Falha 1

    test('SignIn deve retornar 200 e o token', async () => {
        const req = mockRequest({ email: 'test@example.com', password: '123456' });
        const res = mockResponse();
        const token = 'fakeToken';

        usersServices.SignInService.mockResolvedValue({ token });

        await SignIn(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            token,
            message: 'Login realizado com sucesso'
        });
    }); //Sucesso

    //SignUp
    test('SignUp deve retornar 409 se usuário já existir', async () => {
        const req = mockRequest({ email: 'existente@example.com', password: '123456' });
        const res = mockResponse();

        usersServices.SignUpService.mockRejectedValue({ type: 'userExists' });

        await SignUp(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
        expect(res.json).toHaveBeenCalledWith({ message: 'Usuário já existe' });
    }); //Falha 1

    test('SignUp deve retornar 500 em erro inesperado', async () => {
        const req = mockRequest({ email: 'erro@example.com', password: '123456' });
        const res = mockResponse();

        usersServices.SignUpService.mockRejectedValue(new Error('Erro interno'));

        await SignUp(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro interno no servidor' });
    }); //Falha 2

    test('SignUp deve retornar 201 e o usuário criado', async () => {
        const req = mockRequest({ email: 'new@example.com', password: '123456' });
        const res = mockResponse();
        const user = { id: 2, email: 'new@example.com' };

        usersServices.SignUpService.mockResolvedValue(user);

        await SignUp(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: 'Usuário criado',
            success: true,
            id: user.id,
        })
    }); //Sucesso


    //Delete
    test('Delete deve retornar 500 em erro de serviço', async () => {
        const req = mockRequest({ email: 'erro@example.com' });
        const res = mockResponse();

        usersServices.DeleteUserService.mockRejectedValue(new Error('Falha ao deletar'));

        await Delete(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Falha ao deletar' });
    }); //Falha 1

    test('Delete deve retornar 200 ao deletar usuário existente', async () => {
        const req = mockRequest({ email: 'delete@example.com' });
        const res = mockResponse();

        usersServices.DeleteUserService.mockResolvedValue();

        await Delete(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            success: true,
            message: "Usuário deletado com sucesso"
        });
    }); //Sucesso


    //ForgotPassword
    test('ForgotPassword deve retornar 500 em erro de serviço', async () => {
        const req = mockRequest({ email: 'fail@example.com' });
        const res = mockResponse();

        usersServices.ForgotPasswordService.mockRejectedValue(new Error('Erro ao enviar email'));

        await ForgotPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao processar a requisição' });
    }); //Falha 1

    test('ForgotPassword deve retornar 200 e o código gerado', async () => {
        const req = mockRequest({ email: 'forgot@example.com' });
        const res = mockResponse();

        usersServices.ForgotPasswordService.mockResolvedValue(1234);

        await ForgotPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            message: "E-mail enviado",
            code: 1234
        });
    }); //Sucesso


    //Verify
    test('Verify deve retornar 401 se usuário não for encontrado', async () => {
        const req = mockRequest({ email: 'user@example.com', code: 1234 });
        const res = mockResponse();

        usersServices.VerifyCodeService.mockRejectedValue({ type: 'user' });

        await Verify(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
    }); //Falha 1

    test('Verify deve retornar 403 se código for inválido', async () => {
        const req = mockRequest({ email: 'user@example.com', code: 9999 });
        const res = mockResponse();

        usersServices.VerifyCodeService.mockRejectedValue({ type: 'code' });

        await Verify(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
    }); //Falha 2

    test('Verify deve retornar 500 em erro desconhecido', async () => {
        const req = mockRequest({ email: 'user@example.com', code: 1234 });
        const res = mockResponse();

        usersServices.VerifyCodeService.mockRejectedValue(new Error('Erro inesperado'));

        await Verify(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });//Falha 3

    test('Verify deve retornar 202 se o código estiver correto', async () => {
        const req = mockRequest({ email: 'verify@example.com', code: 1234 });
        const res = mockResponse();

        usersServices.VerifyCodeService.mockResolvedValue();

        await Verify(req, res);

        expect(res.status).toHaveBeenCalledWith(202);
        expect(res.json).toHaveBeenCalledWith({
            message: "Usuário verificado",
            success: true
        });
    }); //Sucesso


    //NewPassword
    test('NewPassword deve retornar 400 se email ou senha faltarem', async () => {
        const req = mockRequest({ email: '' });
        const res = mockResponse();

        await NewPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Informações essenciais faltando');
    });//Falha 1

    test('NewPassword deve retornar 500 em erro do serviço', async () => {
        const req = mockRequest({ email: 'reset@example.com', password: 'novaSenha123' });
        const res = mockResponse();

        usersServices.NewPasswordService.mockRejectedValue(new Error('Erro ao atualizar'));

        await NewPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erro ao processar a requisição' });
    });//Falha 2

    test('NewPassword deve retornar 202 se senha for atualizada', async () => {
        const req = mockRequest({ email: 'reset@example.com', password: 'novaSenha123' });
        const res = mockResponse();

        usersServices.NewPasswordService.mockResolvedValue();

        await NewPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(202);
        expect(res.json).toHaveBeenCalledWith({
            message: "Senha mudada",
            success: true
        });
    });
    //Sucesso
});
