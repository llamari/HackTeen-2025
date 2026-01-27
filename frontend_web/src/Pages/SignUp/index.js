import React from "react";
import axios from 'axios';
import './index.css';
import { useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";

function UserRegistration() {
    const navigate = useNavigate();
    async function SignUp(event) {
        event.preventDefault();
        if ((document.getElementById("password").value) === (document.getElementById("password2").value)) {
            const mail = document.getElementById("e-mail").value;
            const password = document.getElementById("password").value;
            try {

                const response = await axios.post('https://inclusound-back.onrender.com/users/signup', {
                    email: mail, password: password
                })

                console.log(response.data);

                if (response.data.success === true) {
                    localStorage.setItem('token', response.data.token);
                    window.location.href = '/';
                } else {
                    document.getElementById("error-message").style.display = 'flex'
                }
            } catch (error) {
                if (error.response && error.response.data && error.response.data.message) {
                    console.error("Erro do backend:", error.response.data.message);
                } else {
                    console.error("Erro inesperado:", error.message);
                }
                document.getElementById("error-message").style.display = 'flex'
            }
        } else {
            document.getElementById('diferent-passwords').style.display = 'flex'
        }

    }

    return (
        <div>
            <section className="section-login">
                <div id="sign-up">
                    <h1 id="title-link-signup">Bem-vindo(a) de volta!</h1>
                    <h2 id="caption-link-signup">Por um mundo com acesso ao conhecimento sem barreiras</h2>
                    <button type="submit" aria-label="Entrar no Sistema IncluSound" className="goToSignup" onClick={() => navigate('/')}>Entrar</button>
                </div>
                <div id="login">
                    <h1 id="title-login">Cadastrar</h1>
                    <h2 id="caption-login">IncluSound, seu sistema de inclusão</h2>
                    <form id="login-form" role="form">
                        <div className="inputLogin">
                            <MdOutlineEmail color="#282828" aria-hidden="true" />
                            <input type="email" id="e-mail" aria-label="E-mail" placeholder="E-mail" />
                        </div>
                        <div className="inputLogin">
                            <CiLock color="#282828"  aria-hidden="true" />
                            <input type="password" aria-label="Senha"  id="password" placeholder="Senha" />
                        </div>
                        <div className="inputLogin">
                            <CiLock color="#282828" aria-hidden="true" />
                            <input type="password" id="password2" aria-label="Confirmar a senha que foi cadastrada acima" placeholder="Confirmar senha" />
                        </div>
                        <span id="diferent-passwords" aria-live="assertive" role="alert" >As senhas devem se iguais!</span>
                        <span id="error-message" aria-live="assertive" role="alert">Já existe uma conta com esse e-mail!</span>                        </form>
                    <button type="submit" aria-label="Cadastrar-se no sistema IncluSound" className="doLogin" onClick={SignUp}>Cadastrar</button>
                </div>
            </section>
        </div>
    )
}


export default UserRegistration;