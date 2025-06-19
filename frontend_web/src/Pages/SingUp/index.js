import React from "react";
import axios from 'axios';
import './index.css';
import { Link } from "react-router-dom";

function UserRegistration() { 
 
    async function SignUp(event) {
        event.preventDefault();
        if ((document.getElementById("password").value) == (document.getElementById("password2").value)) {
            const mail = document.getElementById("e-mail").value;
            const password = document.getElementById("password").value;

            const response = await axios.post('http://localhost:5000/signup', {
                email: mail, password: password 
            })

            console.log(response.data);

            if (response.data.success == true) {
                localStorage.setItem('token', response.data.token);
                window.location.href = '/home';
            } else {
                document.getElementById("error-message").style.display = 'flex'
            }
        } else {
            document.getElementById('diferent-passwords').style.display = 'flex'
        }
    }

    return (
        <div>
            <section className="section">
                <h2 id="title">CADASTRO</h2>
                <form id="singUp" onSubmit={SignUp}>
                    <label htmlFor="e-mail"><b>E-mail:</b></label>
                    <input type="email" id="e-mail" className="input-login" />
                    <label htmlFor="password"><b>Senha:</b></label>
                    <input type="password" id="password" className="input-login" />
                    <label htmlFor="password"><b>Confirme sua senha:</b></label>
                    <input type="password" id="password2" className="input-login" />

                    <p><Link to={'/'} style={{color: '#000', textDecoration: 'none'}}>Já tenho conta</Link></p>
                    
                    <span id="diferent-passwords">As senhas devem se iguais!</span>
                    <span id="error-message">Já existe uma conta com esse e-mail!</span>
                </form>
                <button type="submit" className="go" onClick={SignUp}>CADASTRAR</button>
            </section>
        </div>
    )
}


export default UserRegistration;