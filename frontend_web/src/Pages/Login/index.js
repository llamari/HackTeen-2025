import React from "react";
import axios from 'axios';
import './index.css';
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";

function Login() {
    const navigate = useNavigate();
    async function SignIn(event) {
        event.preventDefault(); // Impede o recarregamento da página
        console.log("Está logando")
        const mail = document.getElementById("e-mail").value;
        const password = document.getElementById("password").value;

        const response = await axios.put('https://inclusound-back.onrender.com/users/signin', {
            email: mail, password: password
        })

        console.log(response.data);

        if (response.data.success == true) {
            localStorage.setItem('token', response.data.token);
            window.location.href = '/home';
        } else {
            document.getElementById('wrong-login').style.display = 'flex'
        }
    }

    return (
        <div>
            <section className="section-login">
                <div id="login">
                    <h1 id="title-login">Entrar</h1>
                    <h2 id="caption-login">IncluSound, seu sistema de inclusão</h2>
                    <form id="login-form">
                        <div className="inputLogin">
                            <MdOutlineEmail color="#282828" />
                            <input type="email" id="e-mail" placeholder="E-mail" />
                        </div>
                        <div className="inputLogin">
                            <CiLock color="#282828" />
                            <input type="password" id="password" placeholder="Senha" />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                            <p><Link to={'/forgot/password'} id="forgotPassLink">Esqueceu a senha?</Link></p>
                        </div>
                        <span id="wrong-login">E-mail ou senha inválidos!</span>
                    </form>
                    <button type="submit" className="doLogin" onClick={SignIn}>ENTRAR</button>
                </div>
                <div id="sign-up">
                    <h1 id="title-link-signup">Novo por aqui?</h1>
                    <h2 id="caption-link-signup">Inscreva-se e escolha como interagir com a informação</h2>
                    <button type="submit" className="goToSignup" onClick={()=> navigate('/signup')}>Cadastrar</button>
                </div>
            </section>
        </div>
    )
}


export default Login;