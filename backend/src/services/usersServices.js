import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import User from '../models/usersModels.js'; 
import { sendEmailWithPassword } from '../utils/sendEmail.js';

export const GetUsersService = async () => {
    const users = await User.findAll(); 
    return users
}

export const SignUpService = async (email, password) => { 
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await User.findOne({where: {email: email}})

    if (userExists) {
        throw { type: 'userExists'};        
    } 
    
    const user = await User.create({ 
        email: email,
        password: hashedPassword,
        code: null
    })

    return user 
}

export const SignInService = async (email, password) => {
    const user = await User.findOne({ where: { email } }); 

    if (!user) {
        throw { type: 'verification', message: 'Usuário não encontrado' };
    }

    const valid = await bcrypt.compare(password, user.password); 

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
    const user = await User.findOne({ where: { email: email } }) 
    if (!user) {
        throw new Error('Usuário não encontrado')
    }

    await User.destroy({ where: { email: email } })
}

export const ForgotPasswordService = async (email) => {
    const user = await User.findOne({ where: { email: email } }) 

    if (!user) {
        throw new Error("Usuário não encontrado"); 
    }

    const code = Math.floor(1000 + Math.random() * 9000);

    await User.update({ code: code }, { where: { email: email } }) 

    console.log("Código gerado:", code);

    sendEmailWithPassword(
        email,
        'Clique aqui para mudar sua senha!',
        `Olá!\nPara alterar sua senha no nosso programa de tradução de textos para sons, insira o código abaixo para confirmar sua identidade: \n${code}`
    );

    return code
}

export const VerifyCodeService = async (code, email) => {
    const user = await User.findOne({ where: { email: email } }); 

    if (!user) {
        throw { type: 'user', message: 'Usuário não encontrado' };
    }
    if (user.code != code) {
        throw { type: 'code', message: 'Código inválido' };
    }

    await User.update({ code: null }, { where: { email: email } }); 
}

export const NewPasswordService = async (email, password) => { 
    const hashed = await bcrypt.hash(password, 10);            

    const user = await User.findOne({ where: { email: email } }); 

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    await User.update({ password: hashed }, { where: { email: email } });
}