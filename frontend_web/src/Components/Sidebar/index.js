import { useNavigate } from "react-router-dom";
import './index.css';

function Sidebar({ largura, sidebarRef }) {
    const navigate = useNavigate()

    return (
        <aside
            ref={sidebarRef} // Adiciona a referência
            id="barra-lateral"
            role="navigation"
            aria-label="Aba lateral de navegação "
            style={{
                width: largura,
                height: "100%",
                backgroundColor: "#1AA1A7",
                position: "fixed",
                top: 0,
                left: 0,
                transition: "0.6s",
                overflowX: "hidden",
                color: "white",
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
            }}
        >
            <h1>Bem vindo(a)!</h1>

            <button className="sidebar-item" aria-label="Ir para a página de Coversão de Texto" onClick={() => navigate('/home')} >
                Conversão de texto
            </button>

            <button className="sidebar-item" aria-label="Ir para a página de Histórico" onClick={() => navigate('/history')} >
                Histórico
            </button>

            <button className="sidebar-item" aria-label="Ir para a página de Proposta e Objetivos" onClick={() => navigate('/objectives')} >
                Proposta e objetivos
            </button>

            <button className="sidebar-item" aria-label="Ir para a página de Salas de Estudo" onClick={() => navigate('/rooms')} >
                Salas de Estudo
            </button>
        </aside>
    )
}

export default Sidebar;