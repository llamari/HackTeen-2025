import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './index.css'

function Home() {
    const token = localStorage.getItem('token');
    const [audioUrl, setAudioUrl] = useState(null);
    const [text, setText] = useState("");
    const [language, setLanguage] = useState("pt-br");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const audioRef = useRef(null);

    useEffect(() => {
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

    async function TextToSpeach(e, texto) {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post(
                'http://localhost:5000/texttosound',
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
                'http://localhost:5000/summarize',
                { text: text },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const summary = response.data.summary;
            TextToSpeach(e, summary)
        } catch (err) {
            console.error("Erro:", err); 
            setError(err.response?.data?.error || 'Erro ao gerar áudio');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div id="main">
            <div id="content">
                <form id="form-tts">
                    <label>Escolha o idioma do seu texto: </label>
                    <select //absolutamente TODOS os idiomas que a biblioteca aceita segundo as minhas pesquisas
                        id="language"
                        value={language}
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
                    <label>Texto: </label>
                    <textarea
                        id="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <div>
                        <button onClick={(e) => TextToSpeach(e, text)} disabled={isLoading || !text}>
                            {isLoading ? 'Processando...' : 'Ouvir áudio'}
                        </button>

                        <button onClick={(e) => Summary(e)}>
                            {isLoading ? 'Processando...' : 'Ouvir áudio do resumo'}
                        </button>
                    </div>
                </form>

                {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
            {audioUrl && (
                <div>
                    <audio
                        ref={audioRef}
                        controls
                        autoPlay
                        key={audioUrl}  // This forces React to recreate the element
                    >
                        <source src={audioUrl} type="audio/mp3" />
                        Seu navegador não suporta a tag de áudio.
                    </audio>
                </div>
            )}
        </div>
    );
}

export default Home;