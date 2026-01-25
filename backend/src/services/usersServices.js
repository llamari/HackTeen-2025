import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import bcrypt from 'bcryptjs';
import User from '../models/usersModels.js';
import { sendEmailWithPassword } from '../utils/sendEmail.js';
import { schema } from '../database/schema/index.js';
import { db } from '../database/connection.js';
import { eq } from 'drizzle-orm';

export const GetUsersService = async () => {
    const users = await db.select().from(schema.users);
    return users
}

export const SignUpService = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await db.select().from(schema.users).where(
        eq(schema.users.email, email)
    );

    if (userExists.length > 0) {
        throw { type: 'userExists' };
    }

    const user = await db.insert(schema.users).values({
        email: email,
        password: hashedPassword,
        code: null
    });
    return user
}

export const SignInService = async (email, password) => {
    const users = await db.select().from(schema.users).where(
        eq(schema.users.email, email)
    );

    const user = users[0];

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
    const users = await db.select().from(schema.users).where(
        eq(schema.users.email, email)
    );

    const user = users[0];

    if (!user) {
        throw new Error('Usuário não encontrado')
    }

    await db.delete(schema.users).where(eq(schema.users.email, email))
}

export const ForgotPasswordService = async (email) => {
    const users = await db.select().from(schema.users).where(
        eq(schema.users.email, email)
    );

    const user = users[0];

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    const code = Math.floor(1000 + Math.random() * 9000);

    await db.update(schema.users).set({ code: code }).where(eq(schema.users.email, email));

    sendEmailWithPassword(
        email,
        'Redefinição de senha – Inclusound',
        `Olá, \n \n Recebemos uma solicitação para redefinir a senha da sua conta no Inclusound. \n \n Para confirmar sua identidade e prosseguir com a alteração de senha, utilize o código de verificação abaixo: \n${code}\nSe você não solicitou a redefinição de senha, pode ignorar este e-mail com segurança. Nenhuma alteração será realizada sem a confirmação do código.\n \nEm caso de dúvidas ou problemas, nossa equipe está à disposição para ajudar.\n \nAtenciosamente, \nEquipe Inclusound`
    );

    return code
}

export const VerifyCodeService = async (code, email) => {
    const users = await db.select().from(schema.users).where(
        eq(schema.users.email, email)
    );

    const user = users[0];

    if (!user) {
        throw { type: 'user', message: 'Usuário não encontrado' };
    }
    if (user.code != code) {
        throw { type: 'code', message: 'Código inválido' };
    }

    await db.update(schema.users).set({ code: null }).where(eq(schema.users.email, email));
}

export const NewPasswordService = async (email, password) => {
    const hashed = await bcrypt.hash(password, 10);

    const users = await db.select().from(schema.users).where(
        eq(schema.users.email, email)
    );

    const user = users[0];

    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    await db.update(schema.users).set({ password: hashed }).where(eq(schema.users.email, email));
}