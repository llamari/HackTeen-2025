import dotenv from 'dotenv';
dotenv.config();
import NodeMailer from 'nodemailer';

export async function sendEmailWithPassword(email, subject, text) {
    try {
        const transporter = NodeMailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // Necessário para TLS
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });

        await transporter.verify();
        console.log("Servidor de e-mail pronto para enviar mensagens!");

        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        });

        console.log("E-mail enviado com sucesso:", info.response);
        return info;
    } catch (error) {
        console.error("Erro ao enviar e-mail:", error);
    }
}