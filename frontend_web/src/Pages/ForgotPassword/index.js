import React, { useEffect, useState } from "react";
import axios from "axios";
import './index.css';
// import Header from "../Componentes/Header";
// import { AlignCenter } from "lucide-react";

function Password() {
    const [user, setuser] = useState();

    async function Send(e) {
        e.preventDefault();
        try {
            const email = document.getElementById("user-email").value;
            setuser(email);
            console.log("E-mail do usuário: ", email)
            document.getElementById("user-email").value = '';

            const response = await axios.put(`http://localhost:5000/forgot/password`, {
                email: email
            });

            const password = response.data;
            console.log(password);
            document.getElementById("mail").style.display = 'none';
            document.getElementById("codigo").style.display = 'flex';
            window.location.href = '#form2';
        } catch (error) {
            console.error("Erro ao enviar requisição: ", error);
        }
    }

    async function Verify(e) {
        e.preventDefault();
        try {
            const code = document.getElementById('code').value;
            console.log(code);
            const response = await axios.put("http://localhost:5000/verify/code", {
                code: code, email: user
            })
            const password = response.data;
            console.log(password);

            document.getElementById("codigo").style.display = 'none';
            document.getElementById("novaSenha").style.display = 'flex';
            window.location.href = '#form3';
        } catch (error) {
            console.error("Erro: ", error)
        }
    }

    async function Change(e) {
        e.preventDefault();
        try {
            const password1 = document.getElementById("senha1").value;
            const password2 = document.getElementById("senha2").value;
            if (password1 == password2) {
                document.getElementById("wrongPassword").style.display = 'none';
                const response = await axios.put("http://localhost:5000/new/password", {
                    password: password1, email: user
                })
                window.location.href = '#senhaRecuperada';
            } else {
                document.getElementById("wrongPassword").style.display = 'flex';
            }
        } catch (error) {

        }
    }

    return (
        <div>
            <section className="section">
                <form onSubmit={(e) => Send(e)} id="mail" className="form-forgot">
                    <h2>Esqueci a senha</h2>
                    <p>Digite seu e-mail no campo abaixo e lhe enviaremos um código de ativação para redefinição da senha</p>
                    <label htmlFor="user-email">Insira seu e-mail</label>
                    <input type="email" id="user-email" className="log"/>
                    <button 
                    type="button" 
                    onClick={Send} 
                    className="send" 
                    >Enviar</button>
                </form>
            </section>
            <section className="section" id="form2">
                <form id="code" style={{display: 'none', flexDirection: 'column'}} className="form-forgot">
                    <h3>Insira no campo abaixo o código enviado no seu e-mail:</h3>
                    <p>Se não encontrar o e-mail na sua caixa de entrada, verifique a pasta de spam ou lixo eletrônico.</p>
                    <div style={{"display": "inline-flex"}}>
                        <br></br>
                        <input type="number" id="code" className="log"/>
                    </div>
                    <button type="submit" onClick={(e) => Verify(e)} className="send">Verificar</button>
                </form>
            </section>
            <section className="section" id="form3">
                <form id="newPassword" style={{display: 'none', flexDirection: 'column'}} className="form-forgot">
                    <h2>Redefina sua senha:</h2>
                    <label>Insira sua senha: </label>
                    <input type="password" id="password1" className="log"/>
                    <label>Repita sua senha: </label>
                    <input type="password" id="password2" className="log"/>
                    <p id="wrongPassword" style={{display: 'none'}}> As senhas devem ser iguais</p>
                    <button onClick={(e) => Change(e)} className="send">Enviar</button>
                </form>
            </section>
            <section className="section" id="RecoverPassword">
                <div className="form-forgot" style={{alignItems: 'center', alignContent: 'center'}}>
                    <h2>Nova senha definida com sucesso!</h2>
                    <button onClick={(e) => window.location.href = '/'} className="send">Ir para o login</button>
                </div>
            </section>
        </div >
    )
}

export default Password;