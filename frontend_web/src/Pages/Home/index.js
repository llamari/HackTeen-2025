import React, { useState, useEffect, useRef } from "react";
import WaveSurferPlayer from "@wavesurfer/react";
import axios from "axios";
import './index.css'
import { LuLogOut } from "react-icons/lu";
import { FaBars, FaPlay, FaPaperclip } from "react-icons/fa6";
import { BsPauseFill } from "react-icons/bs";
import { HiMiniArrowsRightLeft } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";

function Home() {
    const token = localStorage.getItem('token');
    const [audioUrl, setAudioUrl] = useState(null);
    const [text, setText] = useState("");
    const [language, setLanguage] = useState("pt-br");
    const [fileName, setFileName] = useState("Selecionar imagem");
    const [imageToConvert, setImageToConvert] = useState('');
    const [textToBraille, setTextToBraille] = useState('');
    const [brailleToText, setBrailleToText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const audioRef = useRef(null);
    const waveformRefTTS = useRef(null);
    const waveformRefITT = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [toBraille, setToBraille] = useState(true)
    const navigate = useNavigate()
    const [largura, setlargura] = useState(0);
    const sidebarRef = useRef(null);

    function OpenSidebar() {
        setlargura(200);
    }

    function CloseSidebar() {
        setlargura(0);
    }

    useEffect(() => {
        if (!token) {
            navigate('/')
        }
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, [audioUrl]);

    useEffect(() => {
        if (audioRef.current && audioUrl) {
            audioRef.current.load();
        }
    }, [audioUrl]);

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

    async function TextToSpeech(e, texto) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        console.log('Entrou em TextToSpeech')

        try {
            const response = await axios.post(
                'https://inclusound-back.onrender.com/tts',
                { text: texto, language },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    responseType: 'arraybuffer'
                }
            );

            const audioBlob = new Blob([response.data], { type: 'audio/mp3' });
            const url = URL.createObjectURL(audioBlob);
            setAudioUrl(url);

        } catch (err) {
            console.error("Erro:", err);
            setError(err.response?.data?.error || 'Erro ao gerar áudio');
        } finally {
            setIsLoading(false);
        }
    }

    async function Summary(e) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        console.log(text)
        try {
            const response = await axios.post(
                'https://inclusound-back.onrender.com/tts/summarize',
                { text: text },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const summary = response.data.summary;
            TextToSpeech(e, summary)
        } catch (err) {
            console.error("Erro:", err);
            setError(err.response?.data?.error || 'Erro ao gerar áudio');
        } finally {
            setIsLoading(false);
        }
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onloadend = () => {
            const fullBase64 = reader.result; // Ex: data:image/png;base64,abc123...
            const cleanBase64 = fullBase64.split(',')[1]; // Remove o "data:image/...;base64,"

            // Enviar para backend
             enviarImagemParaBackend(cleanBase64);
        };

        if (file) {
            reader.readAsDataURL(file);
            setFileName(file.name)
        }
    }

    async function enviarImagemParaBackend(base64Data) {
        try {
            const response = await axios.post(
                'https://inclusound-back.onrender.com/tts/describeImage',
                { imageBase64: base64Data },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            console.log(response)
            const description = response.data.description;
            setImageToConvert(description);
            const idioma = 'pt-br'
            setLanguage(idioma)
        } catch (err) {
            console.error(err);
            setError('Erro ao descrever a imagem');
        }
    }

    async function convertToBraille(textToConvert) {
        try {
            const response = await axios.post('https://inclusound-back.onrender.com/tts/textToBraille',
                { text: textToConvert },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            setBrailleToText(response.data.result)
        } catch (error) {
            console.log(error)
        }
    }

    async function convertToText(brailleToConvert) {
        try {
            const response = await axios.post('https://inclusound-back.onrender.com/tts/brailleToText',
                { braille: brailleToConvert },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            setTextToBraille(response.data.result)
        } catch (error) {
            console.log(error)
        }
    }

    function LogOut() {
        // eslint-disable-next-line no-restricted-globals
        if (confirm('Você tem certeza de que deseja deslogar da plataforma?') == true) {
            localStorage.removeItem('token')
            navigate('/')
        }
    }

    function openTab(evt, cityName) {
        var i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        setAudioUrl('')
        document.getElementById(cityName).style.display = "block";
        evt.currentTarget.className += " active";
    }

    useEffect(() => {
        const defaultTab = document.getElementById("defaultOpen");
        if (defaultTab) {
            defaultTab.click(); // agora só executa se existir
        }
    }, []);

    return (
        <div id="main">
            <header id="home-header">
                <FaBars aria-label="Abrir aba lateral " role="button" tabIndex={0} onClick={() => OpenSidebar()} style={{cursor: 'pointer'}}/>
                <LuLogOut aria-label="Fazer Logout do Sistema IncluSound" role="button" tabIndex={0}  onClick={() => LogOut()} style={{ cursor: 'pointer' }} />
            </header>
            <Sidebar largura={largura} sidebarRef={sidebarRef} />

            <img src="./assets/logo-inclusound.png" id="logo-image" alt="" aria-hidden="true"/>
            <h1 id="home-caption">A informação pertence a todos</h1>
            <div className="tab" role="tablist" aria-label="Funcionalidades">
                <button className="tablinks" role="tab" onClick={(event) => openTab(event, 'TTS')} id="defaultOpen">Texto para som</button>
                <button className="tablinks" role="tab" onClick={(event) => openTab(event, 'ITT')}>Imagem para som</button>
                <button className="tablinks" role="tab" onClick={(event) => openTab(event, 'Braille')}>Conversões em braille</button>
            </div>
            <div id="TTS" className="tabcontent">
                <form className="form-tts">
                    <label>Texto a ser convertido: </label>
                    <textarea
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Insira o texto que deseja ouvir!"
                    />

                    <label>Idioma: </label>
                    <select //absolutamente TODOS os idiomas que a biblioteca aceita segundo as minhas pesquisas
                        id="language"
                        value={language}
                        aria-label="Selecionar idioma do áudio"
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="af">Africâner (af)</option>
                        <option value="sq">Albanês (sq)</option>
                        <option value="ar">Árabe (ar)</option>
                        <option value="hy">Armênio (hy)</option>
                        <option value="ca">Catalão (ca)</option>
                        <option value="zh">Chinês (zh)</option>
                        <option value="zh-cn">Chinês (China) (zh-cn)</option>
                        <option value="zh-tw">Chinês (Taiwan) (zh-tw)</option>
                        <option value="zh-yue">Cantonês (zh-yue)</option>
                        <option value="hr">Croata (hr)</option>
                        <option value="cs">Tcheco (cs)</option>
                        <option value="da">Dinamarquês (da)</option>
                        <option value="nl">Holandês (nl)</option>
                        <option value="en">Inglês (en)</option>
                        <option value="en-au">Inglês (Austrália) (en-au)</option>
                        <option value="en-uk">Inglês (Reino Unido) (en-uk)</option>
                        <option value="en-us">Inglês (EUA) (en-us)</option>
                        <option value="eo">Esperanto (eo)</option>
                        <option value="fi">Finlandês (fi)</option>
                        <option value="fr">Francês (fr)</option>
                        <option value="de">Alemão (de)</option>
                        <option value="el">Grego (el)</option>
                        <option value="ht">Crioulo Haitiano (ht)</option>
                        <option value="hi">Hindi (hi)</option>
                        <option value="hu">Húngaro (hu)</option>
                        <option value="is">Islandês (is)</option>
                        <option value="id">Indonésio (id)</option>
                        <option value="it">Italiano (it)</option>
                        <option value="ja">Japonês (ja)</option>
                        <option value="ko">Coreano (ko)</option>
                        <option value="la">Latim (la)</option>
                        <option value="lv">Letão (lv)</option>
                        <option value="mk">Macedônio (mk)</option>
                        <option value="no">Norueguês (no)</option>
                        <option value="pl">Polonês (pl)</option>
                        <option value="pt">Português (pt)</option>
                        <option value="pt-br">Português (Brasil) (pt-br)</option>
                        <option value="ro">Romeno (ro)</option>
                        <option value="ru">Russo (ru)</option>
                        <option value="sr">Sérvio (sr)</option>
                        <option value="sk">Eslovaco (sk)</option>
                        <option value="es">Espanhol (es)</option>
                        <option value="es-es">Espanhol (Espanha) (es-es)</option>
                        <option value="es-us">Espanhol (EUA) (es-us)</option>
                        <option value="sw">Suaíli (sw)</option>
                        <option value="sv">Sueco (sv)</option>
                        <option value="ta">Tâmil (ta)</option>
                        <option value="th">Tailandês (th)</option>
                        <option value="tr">Turco (tr)</option>
                        <option value="vi">Vietnamita (vi)</option>
                        <option value="cy">Galês (cy)</option>
                    </select>

                    <div className="flex">
                        <button onClick={(e) => TextToSpeech(e, text)} disabled={isLoading || !text} className="home-button">
                            {isLoading ? 'Processando...' : 'Ouvir áudio'}
                        </button>
                        <button onClick={(e) => Summary(e)} className="home-button">
                            {isLoading ? 'Processando...' : 'Ouvir áudio do resumo'}
                        </button>
                    </div>
                </form>

                {error && <div style={{ color: 'red' }} aria-live="assertive">{error}</div>}
                {audioUrl && (
                    <div style={{ width: "100%", maxHeight: "40px", display: "flex" }} id="audio-player">
                        <div>
                            <button
                                id="play-button"
                                aria-label={isPlaying ? "Pausar áudio"  : "Reproduzir áudio"}
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
            </div>

            <div id="ITT" className="tabcontent">
                <form className="form-tts">
                    <label>Imagem a ser convertida:</label>
                    <label htmlFor="file-upload" className="custom-file-upload">
                        {fileName}
                        <FaPaperclip />
                    </label>
                    <input id="file-upload" aria-label="Selecionar imagem para conversão" type="file" onChange={handleImageChange} />

                    <button  aria-label="Ouvir áudio que descreve a imagem selecionada para conversão" onClick={(e) => TextToSpeech(e, imageToConvert)} disabled={isLoading || !fileName} className="home-button" style={{ margin: 0 }}>
                        Ouvir áudio
                    </button>
                </form>
                {audioUrl && (
                    <div style={{ width: "100%", maxHeight: "40px", display: "flex" }} id="audio-player">
                        <div>
                            <button
                                id="play-button"
                                aria-label={isPlaying ? "Pausar áudio"  : "Reproduzir áudio"}
                                onClick={() => {
                                    if (waveformRefITT.current) {
                                        waveformRefITT.current.playPause();
                                        setIsPlaying(waveformRefITT.current.isPlaying());
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
                                waveformRefITT.current = ws;
                            }}
                            onFinish={() => setIsPlaying(false)}
                        />
                    </div>
                )}
            </div>

            <div id="Braille" className="tabcontent">
                {toBraille ?
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-evenly', fontSize: 'x-large', color: 'black', height: '7vh' }}>
                            Texto
                            <HiMiniArrowsRightLeft aria-label="Fazer conversão de texto para braille" role="button"
                            tabIndex={0} onClick={() => setToBraille(false)} style={{ cursor: 'pointer' }} />
                            Braille
                        </div>
                        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
                            <textarea style={{ minWidth: '50%', maxWidth: '50%', minHeight: '53vh', maxHeight: '53vh', color: '#1E1E1E' }} value={textToBraille} onChange={(e) => {
                                setTextToBraille(e.target.value);
                                convertToBraille(e.target.value)
                            }} />
                            <div style={{
                                display: 'flex',
                                alignItems: 'start',
                                width: '50%',
                                backgroundColor: '#E2E2E2',
                                color: '#1E1E1E',
                                padding: '10px',
                                overflowY: 'auto',
                                height: '53vh',
                                wordBreak: 'break-word',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {brailleToText}
                            </div>

                        </div>
                    </div>
                    :
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-evenly', fontSize: 'x-large', color: 'black', height: '7vh' }}>
                            Braille
                            <HiMiniArrowsRightLeft aria-label="Fazer conversão de braille para texto" role="button"
                            tabIndex={0} onClick={() => setToBraille(true)} style={{ cursor: 'pointer' }} />
                            Texto
                        </div>
                        <div style={{ width: '100%', height: '100%', display: 'flex' }}>
                            <textarea style={{ minWidth: '50%', maxWidth: '50%', minHeight: '53vh', maxHeight: '53vh', color: '#1E1E1E' }} value={brailleToText} onChange={(e) => {
                                setBrailleToText(e.target.value);
                                convertToText(e.target.value)
                            }} />
                            <div style={{
                                display: 'flex',
                                alignItems: 'start',
                                width: '50%',
                                backgroundColor: '#E2E2E2',
                                color: '#1E1E1E',
                                padding: '10px',
                                overflowY: 'auto',
                                height: '53vh',
                                wordBreak: 'break-word',
                                whiteSpace: 'pre-wrap'
                            }}>
                                {textToBraille}
                            </div>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}

export default Home;