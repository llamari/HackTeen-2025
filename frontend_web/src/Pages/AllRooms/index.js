import { useCallback, useEffect, useRef, useState } from "react"
import { Search, MessageCircleQuestion, Clock } from "lucide-react"
import { useNavigate } from "react-router-dom"
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from "dayjs"
import 'dayjs/locale/pt-br'
import axios from "axios"
import './index.css'
import { FaBars } from "react-icons/fa6"
import { LuLogOut } from "react-icons/lu"
import Sidebar from "../../Components/Sidebar"

export function AllRooms() {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([])
    const [filteredRooms, setFilteredRooms] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [newRoom, setNewRoom] = useState({
        name: "",
        description: "",
    })
    const [searchTerm, setSearchTerm] = useState("")
    const [largura, setlargura] = useState(0);
    const sidebarRef = useRef(null);

    function OpenSidebar() {
        setlargura(200);
    }

    function CloseSidebar() {
        setlargura(0);
    }

    const fetchRooms = useCallback(async () => {
        const response = await axios.get('https://inclusound-back.onrender.com/rooms',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        )
        const data = await response.data
        setRooms(data)
    }, [token]);

    useEffect(() => {
        fetchRooms()
    }, [fetchRooms])

    useEffect(() => {
        const filteredRoomsVar = rooms?.filter(
            (room) =>
                room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                room.description.toLowerCase().includes(searchTerm.toLowerCase()),
        )

        setFilteredRooms(filteredRoomsVar)
    }, [searchTerm, rooms])

    useEffect(() => {
        function handleClickOutside(event) {
            if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
                CloseSidebar(); // Fecha a sidebar se o clique for fora dela
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    dayjs.extend(relativeTime);
    dayjs.locale('pt-br')

    async function createRoom(e) {
        e.preventDefault();
        const response = await axios.post('https://inclusound-back.onrender.com/rooms', {
            name: newRoom.name,
            description: newRoom.description
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
        })

        console.log(response.data)

        if (response.status !== 201) {
            return alert("Erro ao criar sala")
        }

        setIsOpen(false)
        setNewRoom({ name: "", description: "" })
        fetchRooms()
    }

    function LogOut() {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Você tem certeza de que deseja deslogar da plataforma?') === true) {
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

            <main id="main-content">
                {/* Search Bar */}
                <div id="search-bar">
                    <button className="open-modal-btn" onClick={() => setIsOpen(true)}>
                        + Crie uma nova sala
                    </button>

                    <div id="bar">
                        <Search id="search-icon" strokeWidth={3} />
                        <input
                            id="search-input"
                            type="text"
                            placeholder="Pesquise salas..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Modal */}
                    {isOpen && (
                        <div className="modal-overlay">
                            <div className="modal">
                                <h2>Crie uma nova sala!</h2>
                                <p className="modal-description">
                                    Crie uma nova sala de estudos para que outros possam se juntar e aprender juntos.
                                </p>

                                <form onSubmit={(e) => createRoom(e)}>
                                    <div className="form-group">
                                        <label htmlFor="room-name">Nome da Sala</label>
                                        <input
                                            id="room-name"
                                            type="text"
                                            placeholder="Digite o nome da sala..."
                                            value={newRoom.name}
                                            onChange={(e) =>
                                                setNewRoom({ ...newRoom, name: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="room-description">Descrição</label>
                                        <textarea
                                            id="room-description"
                                            placeholder="Descreva sobre o que será discutido na sala..."
                                            value={newRoom.description}
                                            onChange={(e) =>
                                                setNewRoom({ ...newRoom, description: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="cancel-btn"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            Cancelar
                                        </button>

                                        <button type="submit" className="submit-btn">
                                            Criar Sala
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Room Grid */}
                {filteredRooms && filteredRooms.length > 0 ? (
                    <div id="card-container">
                        {filteredRooms.map((room) => (
                            <div
                                key={room.id}
                                className="room-card"
                            >
                                <div>
                                    <div className="flex items-start justify-between">
                                        <p className="card-title">{room.name}</p>
                                    </div>
                                    <p className="card-description">
                                        {room.description}
                                    </p>
                                </div>
                                <div className="card-info">
                                    <div className="card-info-div">
                                        <MessageCircleQuestion size={20} />
                                        <span className="room-details">
                                            {room.questionsCount} perguntas
                                        </span>
                                    </div>
                                    <div className="card-info-div">
                                        <Clock size={20} />
                                        <span className="room-details">
                                            {dayjs().from(dayjs(room.createdAt), true)}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className="go-to-room-button"
                                        onClick={() => navigate(`/room/${room.id}`)}
                                    >
                                        Entrar na sala
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
                    :
                    (
                        <div id="no-rooms-found">
                            <MessageCircleQuestion size={30} strokeWidth={3} />
                            <h3 className={`text-lg font-semibold mb-2`}>
                                Nenhuma sala encontrada
                            </h3>
                            <p className="text-purple-200">
                                Tente ajustar seus termos de busca para encontrar mais salas.
                            </p>
                        </div>
                    )}
            </main>
        </div>
    )
}
