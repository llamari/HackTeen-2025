import { LuLogIn  } from "react-icons/lu";
import { useNavigate } from "react-router-dom";

export function WhoAreUs() {
    const navigate = useNavigate();

    return (
        <div id="main">
            <header id="home-header" style={{justifyContent: 'end'}}>
                <LuLogIn  onClick={() => navigate('/login')} style={{ cursor: 'pointer', float: 'right' }} />
            </header>

            <img src="./assets/logo-inclusound.png" id="logo-image" />
            <h1 id="home-caption">A informação pertence a todos</h1>

            <div className="objective-div">
                <h1 className="objective-title">Quem somos</h1>
                <p>
                    O IncluSound é uma startup que promove o acesso à informação para todas as pessoas, independentemente de sua forma de comunicação. Ela assegura que esse acesso ocorra de maneira livre e inclusiva, utilizando diferentes tecnologias que, combinadas, realizam um trabalho admirável.                </p>
            </div>

        </div>
    )
}