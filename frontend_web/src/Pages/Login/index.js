import React from "react";
import axios from 'axios';
import './index.css';
import { Link } from "react-router-dom";

function Login() {

    async function SignIn (event){
        event.preventDefault(); // Impede o recarregamento da página
        console.log("Está logando") 
        const mail = document.getElementById("e-mail").value;
        const password = document.getElementById("password").value;

        const response = await axios.put('http://localhost:5000/signin', {
            email: mail, password: password 
        })

        console.log(response.data);

        if(response.data.success == true){
            localStorage.setItem('token', response.data.token);
            window.location.href = '/home';
        } else{
            document.getElementById('wrong-login').style.display = 'flex'
        }
    }

    return(
        <div>
            <section className="section">
                <h2 id="title">LOGIN</h2>
                <form id="login">
                    <label htmlFor="e-mail"><b>E-mail:</b></label>
                    <input type="email" id="e-mail" className="input-login"/>
                    <label htmlFor="password"><b>Senha:</b></label>
                    <input type="password" id="password" className="input-login"/>

                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <p><Link to={'/forgot/password'} style={{color: '#000', textDecoration: 'none'}}>Esqueci a senha</Link></p>
                        <p><Link to={'/signup'} style={{color: '#000', textDecoration: 'none'}}>Não tenho conta</Link></p>
                    </div>
                    <span id="wrong-login">E-mail ou senha inválidos!</span>
                </form>
                <button type="submit" className="go" onClick={SignIn}>ENTRAR</button>
            </section>
        </div>
    )
}


export default Login;