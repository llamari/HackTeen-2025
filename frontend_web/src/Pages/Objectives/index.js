import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import './index.css'

export function Objectives() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [largura, setlargura] = useState(0);
    const sidebarRef = useRef(null);

    function OpenSidebar() {
        setlargura(200);
    }

    function CloseSidebar() {
        setlargura(0);
    }

    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                CloseSidebar();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (!token) {
            navigate('/')
        }
    }, [])

    function LogOut() {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Você tem certeza de que deseja deslogar da plataforma?') == true) {
            localStorage.removeItem('token')
            navigate('/')
        }
    }
    return (
        <div id="main">
            <header id="home-header">
                <FaBars aria-label="Abrir aba lateral " role="button" tabIndex={0} onClick={() => OpenSidebar()} style={{ cursor: 'pointer' }} />
                <LuLogOut aria-label="Fazer Logout do Sistema IncluSound" role="button" tabIndex={0} onClick={() => LogOut()} style={{ cursor: 'pointer' }} />
            </header>
            <Sidebar largura={largura} sidebarRef={sidebarRef} />

            <img src="./assets/logo-inclusound.png" id="logo-image" alt="" aria-hidden="true" />
            <h1 id="home-caption">A informação pertence a todos</h1>

            <div className="objective-div">
                <h1 className="objective-title">Quem somos</h1>
                <p>
                    A IncluSound é uma startup que promove o acesso à informação para todas as pessoas, independentemente de sua forma de comunicação. Ela assegura que esse acesso ocorra de maneira livre e inclusiva, utilizando diferentes tecnologias que, combinadas, realizam um trabalho admirável. <br />
                    Nossa equipe é formada por jovens talentosos e criativos, que se dedicam intensamente ao desenvolvimento de um sistema funcional, inclusivo e amigável. Eles não irão desistir enquanto não conseguirem proporcionar meios mais acessíveis de adquirir conhecimento!
                </p>

                <h1 className="objective-title">Nossa proposta</h1>
                <p>
                    Segundo dados do censo demográfico do Instituto Brasileiro de Geografia e Estatística (IBGE) de 2010, 18,6% da população brasileira possui algum tipo de deficiência visual. Desse total, 6,5 milhões apresentam deficiência visual severa, sendo que 506 mil têm perda total da visão (0,3% da população) e 6 milhões, grande dificuldade para enxergar (3,2%).<br />
                    Imagine que você fizesse parte desse número de indivíduos com deficiência visual. Você acredita que conseguiria obter um emprego, cursar uma faculdade, estudar ou simplesmente buscar uma informação na internet de forma prática e dinâmica, assim como você consegue hoje?<br />
                    Sem dúvidas, você iria precisar de recursos mais acessíveis e que atendessem amplamente às suas necessidades. Essa é a realidade de 6,5 milhões de pessoas, que devem, necessitam e merecem ter de meios inclusivos para exercerem seus direitos e deveres como cidadãs.  <br />
                </p>
                <p>A IncluSound entende que essas pessoas não são apenas números em gráficos e estimativas — são seres humanos com sonhos e capacidade para realizar o que quiserem. Queremos contribuir para que esses sonhos se tornem realidade. Por isso, desenvolvemos um sistema que converte palavras em áudio, com opção de idioma e resumo, além de disponibilizá-las também em braille.<br />
                </p>

                <h1 className="objective-title">Nosso objetivo</h1>
                <p>
                    Nosso objetivo é eliminar barreiras e tornar o conhecimento acessível para todos, utilizando tecnologia de conversão de texto e explorando novas formas de inclusão digital. <br />
                    Queremos expandir ainda mais nossos recursos de acessibilidade, a fim de atender plenamente às necessidades de todas as pessoas. E buscaremos soluções inovadoras para construir um futuro mais inclusivo, acessível e, acima de tudo, mais humano!
                </p>
                <img src="./assets/graphic.png" alt="Infográfico com dados do IBGE indicando que 45 milhões de brasileiros têm deficiência, 35,5 milhões têm deficiência visual, sendo 6 milhões cegos e 582 mil com baixa visão. Apenas 0,89% dos sites brasileiros passam nos testes de acessibilidade" />

            </div>

        </div>
    )
}