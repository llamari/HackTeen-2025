const jwt = require('jsonwebtoken');
require("dotenv").config();
const bcrypt = require('bcryptjs');
const NodeMailer = require("nodemailer");
const db = require('../database/db');

async function sendEmailWithPassword(email, subject, text) {
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

const GetUsers = (req, res) => {
    db.all(`SELECT * FROM users`, [], (err, rows) => {
        if (err) {
            console.error("Erro ao pegar usuários: ", err);
            return res.status(500).json({ error: "Erro ao buscar usuários" });
        }
        console.log("Usuários: ", rows);
        res.json(rows);
    });
};

const SignIn = async (req, res) => {
    try {
        const { email, senha } = req.body;

        db.get(`SELECT * FROM users WHERE email = ?`, [email], async (err, user) => {
            if (err) {
                return res.status(500).send({ error: err.message });
            }

            const valid = await bcrypt.compare(senha, user.password);

            if (!user || !valid) {
                return res.status(201).send("Login inválido");
            }

            console.log('email:', email, '\nsenha:', senha, '\nUser:', user);

            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

            console.log("Token gerado:", token);

            return res.json({ success: true, token });
        });
    } catch (error) {
        console.error("Erro no SignIn:", error);
        return res.status(500).send("Erro no servidor.");
    }
};

const SignUp = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const password = await bcrypt.hash(senha, 10);
        db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, password], function (err) {
            if (err) return res.status(202).json({ error: err.message, message: 'Já existe uma conta com esse e-mail', success: false });
            res.status(201).json({ message: 'Usuário criado', id: this.lastID, success: true });
        });
    } catch (error) {
        console.error("Error at SignUp: ", error);
        res.status(404)
    }
}

const Delete = async (req, res) => {
    const { email } = req.body;
    db.run(`DELETE FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            console.error("Erro ao deletar usuário:", err.message);
            return res.status(500).json({ error: "Erro ao deletar usuário" });
        }

        if (this.changes === 0) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        res.send({ success: true, message: "Usuário deletado com sucesso" });
    })
}

const ForgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("E-mail recebido: ", email);
        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
            if (err) {
                console.error("Erro ao enviar e-mail para alterar senha: ", error);
                return res.status(500).json({ message: "Erro ao processar a requisição" });
            }

            if (!user) {
                console.log("Não encontrei um usuário com esse e-mail");
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            const code = Math.floor(1000 + Math.random() * 9000); // código de 4 dígitos


            db.run(`UPDATE users SET code = ? WHERE email = ?`, [code, email], function (err) {
                if (err) {
                    console.error("Erro ao atualizar código no banco: ", err);
                    return res.status(500).json({ message: "Erro ao salvar código" });
                }

                console.log("Código gerado:", code);
                sendEmailWithPassword(
                    email,
                    'Clique aqui para mudar sua senha!',
                    `Olá!\nPara alterar sua senha no nosso programa de tradução de textos para sons, insira o código abaixo para confirmar sua identidade: \n${code}`
                );
                res.status(201).json({ message: "E-mail enviado" });

            })})
        } catch (error) {
            console.error("Erro ao enviar e-mail para alterar senha: ", error);
            return res.status(500).json({ message: "Erro ao processar a requisição" });
        }
    }

const Verify = async (req, res) => {
    try {
        const { code, email } = req.body;
        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) =>{
            if (!user) {
                console.log("Usuário não encontrado");
                return res.status(404).json({message: "Usuário não encontrado", success: false})
            }
    
            if (user.code == code) {
                db.run(`UPDATE users SET code = null WHERE email = ?`, [email], (err, user) => {
                    if(err){return res.status(404).send("Erro ao tirar código")}

                    return res.status(202).json({message: "Usuário verificado", success: true})
                })
            }
        })
    } catch (error) {
        console.error("Erro ao verificar codigo: ", error)
        return res.status(500).json({ message: "Erro ao processar a requisição" });
    }
}

const NewPassword = async (req, res) => {
    try {
        const { senha, email } = req.body;
        if (!senha || !email) return res.status(400).send("Missing essential information");
        const hashed = await bcrypt.hash(senha, 10);

        db.run(`UPDATE users SET password = ? WHERE email = ?`, [senha, email], (err, user) => {
            if(err){return res.status(404).send("Erro ao mudar senha")}

            return res.status(202).json({message: "Senha mudada", success: true})
        })

    } catch (error) {
        console.error(`Erro ao trocar senha do usuário ${email}: `, error)
        return res.status(500).json({ message: "Erro ao processar a requisição" });
    }
}

module.exports = { SignUp, SignIn, GetUsers, Delete, ForgotPassword, Verify, NewPassword };