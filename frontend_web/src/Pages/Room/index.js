"use client"

import { useState, useRef, useEffect } from "react"
import { Moon, Sun, Mic, MicOff, Send, ArrowLeft, MessageCircleQuestion, Clock, CheckCircle } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from "dayjs"
import 'dayjs/locale/pt-br'
import axios from "axios"
import Sidebar from "../../Components/Sidebar"
import { FaBars } from "react-icons/fa6"
import { LuLogOut } from "react-icons/lu"
import './index.css'

const isRecordingSupported =
    !!navigator.mediaDevices &&
    typeof navigator.mediaDevices.getUserMedia === 'function' &&
    typeof window.MediaRecorder === 'function'

export function Room() {
    const token = localStorage.getItem('token')
    const navigate = useNavigate()
    const [room, setRoom] = useState({})
    const [isRecording, setIsRecording] = useState(false)
    const [newText, setNewText] = useState("")
    const [newQuestion, setNewQuestion] = useState("")
    const [questions, setQuestions] = useState()
    const recorder = useRef(null)
    const intervalRef = useRef(null)
    const { id } = useParams();
    dayjs.extend(relativeTime);
    dayjs.locale('pt-br')

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
                CloseSidebar(); // Fecha a sidebar se o clique for fora dela
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    async function fetchRooms() {
        const response = await axios.get('https://inclusound-back.onrender.com/rooms',
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        )

        if (response.status !== 200) {
            throw new Error("Erro ao buscar salas")
        }

        const data = await response.data
        const rightRoom = data?.find((room) => room.id === id)
        setRoom(rightRoom)
    }

    async function fetchQuestions() {
        const response = await axios.get(`https://inclusound-back.onrender.com/rooms/questions/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        )

        if (response.status !== 200) {
            throw new Error("Erro ao buscar perguntas")
        }

        const data = await response.data
        setQuestions(data)
    }

    useEffect(() => {
        fetchRooms()
        fetchQuestions()
    }, [id])


    async function AddQuestion(e) {
        e.preventDefault();
        const response = await axios.post(`https://inclusound-back.onrender.com/rooms/questions/${id}`, {
            question: newQuestion
        },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            }
        )

        if (response.status !== 201) {
            throw new Error("Erro ao criar questão")
        }

        fetchQuestions()
    }

    const createRecorder = async (audio) => {
        recorder.current = new MediaRecorder(audio, {
            mimeType: 'audio/webm',
            audioBitsPerSecond: 64_000
        })

        recorder.current.ondataavailable = event => {
            if (event.data.size > 0) {
                uploadAudio(event.data)
            }
        }

        recorder.current.onstart = () => {
            console.log('Gravação iniciada')
        }

        recorder.current.onstop = () => {
            console.log('Gravação finalizada')
        }

    }

    const startRecording = async () => {
        if (!isRecordingSupported) {
            alert('Seu navegador não suporta gravação');
            return
        }

        setIsRecording(true)

        const audio = await navigator.mediaDevices.getUserMedia({
            audio: {
                echoCancellation: true,
                noiseSuppression: true,
                sampleRate: 44_100,
            },
        })

        await createRecorder(audio)

        recorder.current?.start()

        recorder.current.ondataavailable = async event => {
            if (event.data.size > 0) {
                await uploadAudio(event.data)
            }
        }

        recorder.current.start(5000) // timeslice nativo

    }

    const stopRecording = async () => {
        setIsRecording(false)

        if (recorder.current && recorder.current.state !== 'inactive') {
            recorder.current.stop()
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
    }

    async function uploadAudio(audio) {
        try {
            const formData = new FormData()
            formData.append('file', audio, 'audio.webm')

            const response = await axios.post(
                `https://inclusound-back.onrender.com/rooms/${id}/audio`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        // NÃO definir Content-Type manualmente
                    }
                }
            )

            console.log('Transcrição recebida:', response.data.transcription)
            console.log('Embedding recebido:', response.data.embeddings)

            return response.data
        } catch (error) {
            console.error('Erro ao enviar áudio:', error.response?.data || error)
            throw new Error('Erro ao transcrever áudio')
        }
    }

    async function sendText() {
        try {
            const response = await axios.post(
                `https://inclusound-back.onrender.com/rooms/${id}/text`,
                {
                    text: newText
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )

            console.log('Resposta do servidor:', response.data)
            fetchQuestions()
        } catch (error) {
            console.error('Erro ao enviar texto:', error.response?.data || error)
        }
    }

    function LogOut() {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Você tem certeza de que deseja deslogar da plataforma?') === true) {
            localStorage.removeItem('token')
            navigate('/')
        }
    }

    return (
        <div id="main"
        >
            <header id="home-header">
                <FaBars aria-label="Abrir aba lateral " role="button" tabIndex={0} onClick={() => OpenSidebar()} style={{ cursor: 'pointer' }} />
                <LuLogOut aria-label="Fazer Logout do Sistema IncluSound" role="button" tabIndex={0} onClick={() => LogOut()} style={{ cursor: 'pointer' }} />
            </header>
            <Sidebar largura={largura} sidebarRef={sidebarRef} />


            <div id="room-header">
                <h1>{room?.name}</h1>
                <div>
                    <p>{room?.description}</p>
                </div>
            </div>

            {/* Main Content */}
            <main>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recording and Question Section */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Audio Recording */}
                        <div id="new-content-container">
                            <div id="new-content-header">
                                <h2>Adicionar conteúdo</h2>
                                <h4>
                                    Grave sua voz ou escreva textos para fazer perguntas sobre o conteúdo
                                </h4>
                            </div>
                            <div id="new-content">
                                <button
                                    onClick={isRecording ? stopRecording : startRecording}
                                    id="recorder"
                                    className={isRecording && "recording"}
                                >
                                    {isRecording ? (
                                        <>
                                            <MicOff className="h-4 w-4 mr-2" />
                                            Parar gravação
                                        </>
                                    ) : (
                                        <>
                                            <Mic className="h-4 w-4 mr-2" />
                                            Iniciar gravação
                                        </>
                                    )}
                                </button>

                                <div id="new-text">
                                    <textarea
                                        value={newText}
                                        onChange={(e) => setNewText(e.target.value)}
                                    />
                                    <button onClick={sendText}>Enviar Texto</button>
                                </div>
                            </div>
                        </div>

                        {/* Question Form */}
                        <div id="question-form-container">
                            <div>
                                <h2>Faça uma pergunta</h2>
                                <h4>
                                    Pergunte sobre o que foi discutido na gravação
                                </h4>
                            </div>
                            <form onSubmit={(e) => AddQuestion(e)}>
                                <textarea
                                    value={newQuestion}
                                    onChange={(e) => setNewQuestion(e.target.value)}
                                    placeholder="O que você gostaria de perguntar?"
                                    id="new-question"
                                    required
                                />
                                <button
                                    type="submit"
                                    id="send-new-question"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Enviar Pergunta
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Questions and Answers List */}
                <div id="questions-container">
                    <div>
                        <h2 className={`text-xl text-gray-900"}`}>
                            Perguntas e Respostas
                        </h2>
                        <p className={"text-purple-600"}>
                            Todas as perguntas feitas nesta sala e suas respostas
                        </p>
                    </div>
                    <div id="questions-list">
                        {questions && questions.map((qa) => (
                            <div
                                key={qa.id}
                                className="question-card"
                            >
                                <div className="question-info">
                                    <div className="flex items-center gap-2">
                                        <MessageCircleQuestion
                                            className={`h-4 w-4 text-purple-500"}`}
                                        />
                                        <span className={`text-sm text-purple-600"}`}>
                                            Pergunta
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div
                                            variant={qa.answer ? "default" : "secondary"}
                                            className={`${qa.answer
                                                ? "bg-green-600 text-white"
                                                : "bg-purple-100 text-purple-700"
                                                }`}
                                        >
                                            {qa.answer ? (
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                            ) : (
                                                <Clock className="h-3 w-3 mr-1" />
                                            )}
                                            {qa.answer ? "Respondida" : "Pendente"}
                                        </div>

                                    </div>
                                    <div>
                                        <span className={`text-xs text-purple-500"}`}>
                                            {dayjs().from(dayjs(qa.createdAt), true)}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="question-text">{qa.question}</h3>

                                {qa.answer ? (
                                    <div
                                        className={`p-3 rounded border-l-4 bg-white border-l-purple-500 text-gray-700"
                                                        }`}
                                    >
                                        <p className="answer-text">{qa.answer}</p>
                                    </div>
                                ) : (
                                    <div
                                        className={`p-3 rounded border-l-4 "bg-white border-l-purple-500 text-gray-700"
                                                        }`}
                                    >
                                        <p>Esperando resposta da IA</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}
