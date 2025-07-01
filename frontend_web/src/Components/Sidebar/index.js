import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './index.css';

function Sidebar({ largura, sidebarRef }) {
    const navigate = useNavigate()

    function LogOut() {
        localStorage.removeItem('token');
        window.location.href = '/';
    }

    return (
        <aside
            ref={sidebarRef} // Adiciona a referência
            id="barra-lateral"
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

            <div className="sidebar-item" onClick={() => navigate('/home')} >
                Conversão de texto
            </div>

            <div className="sidebar-item" onClick={() => navigate('/history')} >
                Histórico
            </div>

            <div className="sidebar-item" onClick={() => navigate('/objectives')} >
                Proposta e objetivos
            </div>
        </aside>
    )
}

export default Sidebar;