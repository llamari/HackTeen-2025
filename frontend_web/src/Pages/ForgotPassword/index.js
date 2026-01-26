import React, { useState } from "react";
import axios from "axios";
import './index.css';
import { MdOutlineEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

function Password() {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password1, setPassword1] = useState("");
    const [password2, setPassword2] = useState("");
    const [showError, setShowError] = useState(false);
    const navigate = useNavigate();

    async function Send(e) {
        e.preventDefault();
        try {
            const apiUrl = process.env.API_URL || 'http://localhost:5000';
            const response = await axios.put(`${apiUrl}/users/forgot/password`, { email });
            console.log("Código enviado:", response.data);
            setStep(2);
        } catch (error) {
            console.error("Erro ao enviar código:", error);
        }
    }

    async function Verify(e) {
        e.preventDefault();
        try {
            const response = await axios.put("https://inclusound-back.onrender.com/users/verify/code", {
                code, email
            });
            console.log("Código verificado:", response.data);
            setStep(3);
        } catch (error) {
            console.error("Erro ao verificar código:", error);
        }
    }

    async function Change(e) {
        e.preventDefault();
        if (password1 !== password2) {
            setShowError(true);
            return;
        }

        try {
            await axios.put("https://inclusound-back.onrender.com/users/new/password", {
                password: password1, email
            });
            setStep(4);
        } catch (error) {
            console.error("Erro ao redefinir senha:", error);
        }
    }

    return (
    
    <main role="main">
        <div>
            {step === 1 && (
                <section className="section">
                    <h2 className="title-pass">Redefinição de senha</h2>
                    <form onSubmit={Send} className="form-forgot">
                        <p>Insira seu e-mail para receber um código de autenticação</p>
                        <div className="inputLogin">
                            <MdOutlineEmail color="#282828" aria-hidden="true" />
                            <input
                                type="email"
                                placeholder="E-mail"
                                aria-label="Inserir e-mail"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex">
                            <button type="button" onClick={() => navigate(-1)} className="send">Voltar</button> 
                            <button type="submit" className="send">Enviar</button>
                        </div>
                    </form>
                </section>
            )}

            {step === 2 && (
                <section className="section">
                    <h2 className="title-pass">Verificação de código</h2>
                    <form onSubmit={Verify} className="form-forgot">
                        <p>Insira o código que foi enviado ao seu e-mail</p>
                        <div className="inputLogin">
                            <CiLock color="#282828" aria-hidden="true" />
                            <input
                                type="text"
                                placeholder="Código"
                                aria-label="Código"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex">
                            <button type="button" onClick={() => setStep(1)} className="send">Voltar</button>
                            <button type="submit" className="send">Verificar</button>
                        </div>
                    </form>
                </section>
            )}

            {step === 3 && (
                <section className="section">
                    <h2 className="title-pass">Nova senha</h2>
                    <form onSubmit={Change} className="form-forgot" id="newPassword">
                        <div className="inputLogin">
                            <CiLock color="#282828" aria-hidden="true" />
                            <input
                                type="password"
                                placeholder="Nova senha"
                                aria-label="Inserir nova senha"
                                value={password1}
                                onChange={(e) => setPassword1(e.target.value)}
                                required
                            />
                        </div>
                        <div className="inputLogin">
                            <CiLock color="#282828" aria-hidden="true" />
                            <input
                                type="password"
                                placeholder="Confirmar senha"
                                aria-label="Confirmar nova senha"
                                aria-describedby={showError ? "erro-senha" : undefined}
                                value={password2}
                                onChange={(e) => setPassword2(e.target.value)}
                                required
                            />
                        </div>
                        {showError && <p id="erro-senha" style={{ color: "red", fontWeight: 500 }}>As senhas devem ser iguais</p>}
                        <div className="flex">
                            <button type="button" onClick={() => setStep(2)} className="send">Voltar</button>
                            <button type="submit" className="send">Redefinir</button>
                        </div>
                    </form>
                </section>
            )}

            {step === 4 && (
                <section className="section">
                    <div className="form-forgot" style={{ alignItems: 'center' }} aria-live="polite">
                        <h2>Nova senha definida com sucesso!</h2>
                        <button onClick={() => navigate('/')} className="send">Ir para o login</button>
                    </div>
                </section>
            )}
        </div>
    </main>
    );
}

export default Password;
