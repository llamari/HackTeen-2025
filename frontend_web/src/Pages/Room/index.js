"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Mic, MicOff, Send, MessageCircleQuestion, Clock, CheckCircle } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from "dayjs"
import 'dayjs/locale/pt-br'
import axios from "axios"
import Sidebar from "../../Components/Sidebar"
import { FaBars, FaPlay } from "react-icons/fa6"
import { LuLogOut } from "react-icons/lu"
import './index.css'
import { BsPauseFill } from "react-icons/bs"
import WaveSurferPlayer from "@wavesurfer/react";

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
    const [audioUrl, setAudioUrl] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const waveformRefTTS = useRef(null)
    const recorder = useRef(null)
    const intervalRef = useRef(null)
    const streamRef = useRef(null)
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

    const getAudio = useCallback(async (roomData) => {
        console.log("Buscando áudio para a sala...")
        try {
            const texto = roomData.roomTexts
                ?.map(rt => rt.transcript)
                ?.join(' ')
                ?.trim();

            if (!texto || texto.length === 0) {
                console.log("Nenhum texto encontrado para converter em áudio");
                return;
            }

            const response = await axios.post(
                'https://inclusound-back.onrender.com/tts',
                { text: texto, language: 'pt-br' },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }
            );

            console.log("Áudio buscado com sucesso!");
            const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);
        } catch (error) {
            console.error('Erro ao buscar áudio:', error.response?.data || error);
        }
    }, [token]);

    const fetchRoom = useCallback(async () => {
        const response = await axios.get(`https://inclusound-back.onrender.com/rooms/${id}`,
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
        console.log(data)
        const rightRoom = data?.id === id ? data : null
        setRoom(rightRoom)
        getAudio(rightRoom)
    }, [id, token, getAudio])

    const fetchQuestions = useCallback(async () => {
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
    }, [id, token])

    useEffect(() => {
        fetchRoom()
        fetchQuestions()
    }, [id, fetchRoom, fetchQuestions]);


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

        setNewQuestion("")
        alert("Pergunta enviada com sucesso!")
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

        streamRef.current = audio

        await createRecorder(audio)

        recorder.current.ondataavailable = async event => {
            if (event.data.size > 0) {
                await uploadAudio(event.data)
            }
        }

        recorder.current.start()

        // Configurar timer para enviar chunks a cada 5 segundos
        intervalRef.current = setInterval(async () => {
            if (recorder.current && recorder.current.state === 'recording') {
                recorder.current.stop()
                // O ondataavailable será chamado automaticamente

                // Reiniciar gravação após um pequeno delay
                setTimeout(() => {
                    if (isRecording && recorder.current && recorder.current.state === 'inactive') {
                        recorder.current.start()
                    }
                }, 100)
            }
        }, 5000)
    }

    const stopRecording = async () => {
        setIsRecording(false)

        if (recorder.current && recorder.current.state !== 'inactive') {
            recorder.current.stop()
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop())
            streamRef.current = null
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
            const textSentences = newText
                .split('.')
                .map(sentence => sentence.trim())
                .filter(sentence => sentence.length > 0)

            textSentences.forEach(async (sentence) => {
                await axios.post(
                    `https://inclusound-back.onrender.com/rooms/${id}/text`,
                    {
                        text: sentence
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                )
            })

            setNewText("")
            alert("Texto enviado com sucesso!")
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
            <main id="room-main-content">
                <div>
                    {/* Recording and Question Section */}
                    <div>
                        {/* Audio Recording */}
                        {room.ownedByUser && (
                            <div id="new-content-container" className="room-subcontainer">
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
                        )}

                        <div className="room-subcontainer">
                            <h2>Conteúdo da sala</h2>

                            {audioUrl && (
                                <div style={{ width: "100%", maxHeight: "40px", display: "flex", marginBottom: "10px" }} id="audio-player">
                                    <div>
                                        <button
                                            id="play-button"
                                            aria-label={isPlaying ? "Pausar áudio" : "Reproduzir áudio"}
                                            onClick={() => {
                                                if (waveformRefTTS.current) {
                                                    waveformRefTTS.current.playPause();
                                                    setIsPlaying(waveformRefTTS.current.isPlaying());
                                                }
                                            }}>
                                            {isPlaying ? <BsPauseFill /> : <FaPlay />}
                                        </button>
                                    </div>
                                    <WaveSurferPlayer
                                        height={40}
                                        width={200}
                                        waveColor="#fff"
                                        progressColor="#8bc5c7"
                                        url={audioUrl}
                                        normalize={true}
                                        responsive={true}
                                        onReady={(ws) => {
                                            waveformRefTTS.current = ws;
                                        }}
                                        onFinish={() => setIsPlaying(false)}
                                    />
                                </div>
                            )}

                            <div>
                                <h4>
                                    {room.roomTexts && room.roomTexts.map((content) => (
                                        <>
                                            {content.transcript} &nbsp;
                                        </>
                                    ))}
                                </h4>
                            </div>
                        </div>

                        {/* Question Form */}
                        <div className="room-subcontainer">
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
                <div className="room-subcontainer">
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
                                    <div className="question-info-item">
                                        <MessageCircleQuestion
                                            className={`h-4 w-4 text-purple-500"}`}
                                        />
                                        <span className={`text-sm text-purple-600"}`}>
                                            Pergunta
                                        </span>
                                    </div>
                                    <div className="question-info-item">
                                        {qa.answer ? (
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                        ) : (
                                            <Clock className="h-3 w-3 mr-1" />
                                        )}
                                        {qa.answer ? "Respondida" : "Pendente"}
                                    </div>
                                    <div className="question-info-item">
                                        <span className={`text-xs text-purple-500"}`}>
                                            {dayjs().from(dayjs(qa.createdAt), true)}
                                        </span>
                                    </div>
                                </div>

                                <h3 className="question-text">{qa.question}</h3>

                                {qa.answer ? (
                                    <div>
                                        <p className="answer-text">{qa.answer}</p>
                                    </div>
                                ) : (
                                    <div>
                                        <p className="answer-text">Esperando resposta da IA</p>
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
