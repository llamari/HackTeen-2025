import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa6";
import { LuLogOut } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";
import './index.css'

export function History() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [texts, setTexts] = useState([]);
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
        } else {
            async function getTexts() {
                const response = await axios.get(
                    'https://inclusound-back.onrender.com/tts/yourtexts',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                    }
                );

                console.log(response.data)

                function encontrarElementosUnicos(array) {
                    const vistos = new Set();
                    const unicos = [];

                    for (const item of array) {
                        if (!vistos.has(item.content)) {
                            unicos.push(item);
                            vistos.add(item.content);
                        }
                    }

                    unicos.reverse()
                    return unicos;
                }


                setTexts(encontrarElementosUnicos(response.data.texts))
            }

            getTexts()
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

            <img src="./assets/logo-inclusound.png" id="logo-image" alt="" aria-hidden="true"/>
            <h1 id="home-caption">A informação pertence a todos</h1>

            <div className="background-subject">
                <h1>Todas as informações já convertidas por você!</h1>
                {texts.map((text) => (
                    <div key={text.id} className="text-history">
                        <p>{text.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}