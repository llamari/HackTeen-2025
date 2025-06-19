import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import Usuario from '../models/usersModels.js';
import { sendEmailWithPassword } from '../utils/sendEmail.js';

export const GetUsersService = async () => {
    const users = await Usuario.findAll();
    return users
}

export const SignUpService = async (email, senha) => {
    const password = await bcrypt.hash(senha, 10);

    const userExists = await Usuario.findOne({where: {email: email}})

    if (userExists) {
        throw { type: 'userExists'};        
    } 
    
    const usuario = await Usuario.create({
        email: email,
        password: password,
        code: null
    })

    return usuario
}

export const SignInService = async (email, senha) => {
    const user = await Usuario.findOne({ where: { email } });

    if (!user) {
        throw { type: 'verification', message: 'Usuário não encontrado' };
    }

    const valid = await bcrypt.compare(senha, user.password);

    if (!valid) {
        throw { type: 'verification', message: 'Login inválido' };
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    return {
        token,
        user
    };
};

export const DeleteUserService = async (email) => {
    const user = await Usuario.findOne({ where: { email: email } })
    if (!user) {
        throw new Error('Usuário não encontrado')
    }

    await Usuario.destroy({ where: { email: email } })
}

export const ForgotPasswordService = async (email) => {
    const user = await Usuario.findOne({ where: { email: email } })

    if (!user) {
        throw new Error("Usuário não encntrado");
    }

    const code = Math.floor(1000 + Math.random() * 9000);

    await Usuario.update({ code: code }, { where: { email: email } })

    console.log("Código gerado:", code);

    sendEmailWithPassword(
        email,
        'Clique aqui para mudar sua senha!',
        `Olá!\nPara alterar sua senha no nosso programa de tradução de textos para sons, insira o código abaixo para confirmar sua identidade: \n${code}`
    );

    return code
}

export const VerifyCodeService = async (code, email) => {
    const user = await Usuario.findOne({ where: { email: email } });

    if (!user) {
        throw { type: 'user', message: 'Usuário não encontrado' };
    }
    if (user.code != code) {
        throw { type: 'code', message: 'Código inválido' };
    }

    await Usuario.update({ code: null }, { where: { email: email } });
}

export const NewPasswordService = async (email, senha) => {
    const hashed = await bcrypt.hash(senha, 10);

    const user = await Usuario.findOne({ where: { email: email } });

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    await Usuario.update({ password: hashed }, { where: { email: email } });
}