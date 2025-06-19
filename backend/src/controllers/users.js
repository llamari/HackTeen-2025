import dotenv from 'dotenv';
dotenv.config();
import { DeleteUserService, ForgotPasswordService, GetUsersService, NewPasswordService, SignInService, SignUpService, VerifyCodeService } from '../services/usersServices.js';


export const GetUsers = async (req, res) => {
    const users = await GetUsersService();
    res.json(users);
};

export const SignIn = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: 'Email e senha são obrigatórios', success: false });
        }

        const { token } = await SignInService(email, senha);

        return res.status(200).json({
            success: true,
            token,
            message: 'Login realizado com sucesso'
        });
    } catch (error) {
        console.error('Error at SignIn:', error);
        if (error.type == "verification") {
            return res.status(401).json({
                message: 'Erro de autenticação',
                success: false,
                error: error.message
            });
        }
        return res.status(500).json({
            message: 'Erro no servidor',
            success: false,
            error: error.message
        });
    }
};

export const SignUp = async (req, res) => {
    try {
        const { email, senha } = req.body;

        const usuario = await SignUpService(email, senha)

        res.status(201).json({ message: 'Usuário criado', id: usuario.id, success: true });
    } catch (error) {
        if (error.type === "userExists") {
            res.status(409).json({message: 'Usuário já existe'})
        }
        console.error("Error at SignUp: ", error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
}

export const Delete = async (req, res) => {
    try {
        const { email } = req.body;

        await DeleteUserService(email);

        res.status(200).send({ success: true, message: "Usuário deletado com sucesso" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        code = await ForgotPasswordService(email);

        res.status(200).json({ message: "E-mail enviado", code: code});
    } catch (error) {
        console.error("Erro ao enviar e-mail para alterar senha: ", error);
        return res.status(500).json({ message: "Erro ao processar a requisição" });
    }
}

export const Verify = async (req, res) => {
    try {
        const { code, email } = req.body;

        await VerifyCodeService(code, email);

        return res.status(202).json({ message: "Usuário verificado", success: true })
    } catch (error) {
        console.error("Erro ao verificar codigo: ", error)
        if (error.type == "user") {
            return res.status(401);
        }
        if (error.type == "code") {
            return res.status(403);
        }
        return res.status(500);
    }
}

export const NewPassword = async (req, res) => {
    try {
        const { senha, email } = req.body;
        if (!senha || !email) return res.status(400).send("Informações essenciais faltando");

        await NewPasswordService(email, senha);

        return res.status(202).json({ message: "Senha mudada", success: true })
    } catch (error) {
        console.error(`Erro ao trocar senha do usuário ${email}: `, error)
        return res.status(500).json({ message: "Erro ao processar a requisição" });
    }
}