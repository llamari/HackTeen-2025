import path from 'path';
import gTTS from 'gtts';
import Text from '../models/ttsModels.js';
import { fileURLToPath } from 'url';
import axios from 'axios';
import SummarizerManager from 'node-summarizer/src/SummarizerManager.js';
import { text } from 'stream/consumers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TextToSoundService = async (userId, text, language) => {
    const filename = `audio-${Date.now()}.mp3`;
    const filepath = path.join(__dirname, filename);

    try {
        await Text.create({
            content: text,
            user_id: userId
        });
    } catch (error) {
        throw { type: 'db', message: 'Erro ao salvar texto no banco.' };
    }

    return new Promise((resolve, reject) => {
        const gtts = new gTTS(text, language);

        gtts.save(filepath, (err) => {
            if (err) {
                reject({ type: 'audio', message: 'Erro ao gerar áudio.' });
            } else {
                resolve(filepath);
            }
        });
    });
};

export const SummariseService = async (userId, text) => {
    try {
        const requestBody = {
            contents: [
                {
                    parts: [
                        { text: `Resuma o seguinte texto, no idioma que estiver: \n${text}` }
                    ],
                },
            ],
        };

        const API_KEY = process.env.API_KEY;
        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await axios.post(API_URL, requestBody);

        const result = response.data.candidates[0]?.content?.parts[0]?.text || '';

        try {
            await Text.create({
                content: result,
                user_id: userId
            });
        } catch (error) {
            throw { type: 'db', message: 'Erro ao salvar texto no banco.' };
        }

        return result;
    } catch (error) {
        console.error('Erro ao chamar a API:', error.response ? error.response.data : error.message);
        return '';
    }
};

export const DescribeImageService = async (userId, imageBase64) => {
    try {
        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            inlineData: {
                                mimeType: "image/jpeg", // ou "image/png"
                                data: imageBase64
                            }
                        },
                        {
                            text: "Descreva detalhadamente o conteúdo visual desta imagem. Se houver textos, os repitá-os em sua resposta."
                        }
                    ]
                }
            ]
        };

        const API_KEY = process.env.API_KEY;
        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await axios.post(API_URL, requestBody);

        const result = response.data.candidates[0]?.content?.parts[0]?.text || 'Não foi possível gerar uma descrição.';
        
        try {
            await Text.create({
                content: result,
                user_id: userId
            });
        } catch (error) {
            throw { type: 'db', message: 'Erro ao salvar texto no banco.' };
        }
        
        return result;

    } catch (error) {
        console.error('Erro ao descrever imagem:', error.response?.data || error.message);
        return 'Erro ao gerar descrição.';
    }
};

export const YourTextsService = async (userId) => {
    const texts = await Text.findAll({ where: { user_id: userId } })
    return texts
}

export const BrailleService = async (text, userId) => {
    console.log(text)
    var result = ''
    var isNumber = false;
    const brailleMap = {
        "a": "⠁", "á": "⠷", "b": "⠃", "c": "⠉", "ç": "⠯", "d": "⠙", "e": "⠑",
        "é": "⠮", "f": "⠋", "g": "⠛", "h": "⠓", "i": "⠊", "í": "⠌", "j": "⠚",
        "k": "⠅", "l": "⠇", "m": "⠍", "n": "⠝", "o": "⠕", "ó": "⠬",
        "p": "⠏", "q": "⠟", "r": "⠗", "s": "⠎", "t": "⠞",
        "u": "⠥", "ú": "⠾", "v": "⠧", "w": "⠺", "x": "⠭", "y": "⠽",
        "z": "⠵",

        // Números (prefixo ⠼)
        "1": "⠁", "2": "⠃", "3": "⠉", "4": "⠙", "5": "⠑",
        "6": "⠋", "7": "⠛", "8": "⠓", "9": "⠊", "0": "⠚",

        // Pontuação
        ".": "⠲",
        ",": "⠂",
        ";": "⠆",
        ":": "⠒",
        "!": "⠖",
        "?": "⠦",
        "(": "⠐⠣",
        ")": "⠐⠜",
        "-": "⠤",
        "'": "⠄",
        "\"": "⠶",
        "/": "⠌",
        "@": "⠈⠁",
        " ": "⠀"
    };

    text.split('').map((char) => {
        if (char.match(/[A-Z]/)) {
            result += '⠠';
        }

        if (char.match(/[0-9]/) && !isNumber) {
            result += '⠼';  // sinal de número (só uma vez por sequência)
            isNumber = true;
        }

        if (!char.match(/[0-9]/)) {
            isNumber = false;  // sai do modo número
        }

        if (brailleMap[char.toLowerCase()]) {
            result += brailleMap[char.toLowerCase()];
        } else {
            throw { type: 'invalid', message: 'Caractere inválido' };
        }
    })

    console.log(result);

    await Text.create({
        content: text,
        user_id: userId
    })
    return result;
}

export const BrailleToTextService = async (braille, userId) => {
    var result = ''
    var numbers = false;
    var upperCase = false;
    const brailleMap = {
        "⠁": "a", "⠷": "á", "⠃": "b", "⠉": "c", "⠯": "ç", "⠙": "d", "⠑": "e",
        "⠮": "é", "⠋": "f", "⠛": "g", "⠓": "h", "⠊": "i", "⠌": "í", "⠚": "j",
        "⠅": "k", "⠇": "l", "⠍": "m", "⠝": "n", "⠕": "o", "⠬": "ó",
        "⠏": "p", "⠟": "q", "⠗": "r", "⠎": "s", "⠞": "t",
        "⠥": "u", "⠾": "ú", "⠧": "v", "⠺": "w", "⠭": "x", "⠽": "y",
        "⠵": "z",

        // Números (prefixo ⠼)


        "⠲": ".",
        "⠂": ",",
        "⠆": ";",
        "⠒": ":",
        "⠖": "!",
        "⠦": "?",
        "⠐⠣": "(",
        "⠐⠜": ")",
        "⠤": "-",
        "⠄": "'",
        "⠶": "\"",
        "⠌": "/",
        "⠈⠁": "@",
        "⠀": " "
    };

    const brailleNumbers = {
        "⠁": "1", "⠃": "2", "⠉": "3", "⠙": "4", "⠑": "5",
        "⠋": "6", "⠛": "7", "⠓": "8", "⠊": "9", "⠚": "0",
    }

    braille.split('').map((char) => {
        if (char == '⠼') {
            numbers = true;
        } else {
            if (numbers) {
                var num = brailleNumbers[char];
                if (num) {
                    result += num
                    num = null
                } else {
                    numbers = false;
                    result += brailleMap[char];
                }
            } else {
                if (char == '⠠') {
                    upperCase = true;
                } else {
                    if (upperCase) {
                        var letter = brailleMap[char]
                        if (letter) {
                            result += letter.toUpperCase()
                        }
                        upperCase = false
                    } else {
                        upperCase = false
                        var letter = brailleMap[char]
                        if (letter) {
                            result += brailleMap[char];
                        } else {
                            throw { type: 'invalid', message: 'Caractere inválido' };
                        }
                    }
                }
            }
        }
    })

    console.log(result);
    await Text.create({
        content: result,
        user_id: userId
    })
    return result;
}

export const BrailleForDisplayService = async (text, userId) => {
    const result = await BrailleService(text, userId)

    const brailleToBinary = {
        "⠁": '{1, 0, 0, 0, 0, 0}',    // a
        "⠷": '{1, 0, 1, 1, 1, 1}',    // á
        "⠃": '{1, 0, 1, 0, 0, 0}',    // b
        "⠉": '{1, 1, 0, 0, 0, 0}',    // c
        "⠯": '{1, 1, 1, 0, 1, 1}',    // ç
        "⠙": '{1, 1, 0, 1, 0, 0}',    // d
        "⠑": '{1, 0, 0, 1, 0, 0}',    // e
        "⠮": '{0, 1, 1, 0, 1, 1}',    // é
        "⠋": '{1, 1, 1, 0, 0, 0}',    // f
        "⠛": '{1, 1, 1, 1, 0, 0}',    // g
        "⠓": '{1, 0, 1, 1, 0, 0}',    // h
        "⠊": '{0, 1, 1, 0, 0, 0}',    // i
        "⠌": '{0, 1, 0, 0, 1, 0}',    // í
        "⠚": '{0, 1, 1, 1, 0, 0}',    // j
        "⠅": '{1, 0, 0, 0, 1, 0}',    // k
        "⠇": '{1, 0, 1, 0, 1, 0}',    // l
        "⠍": '{1, 1, 0, 0, 1, 0}',    // m
        "⠝": '{1, 1, 0, 1, 1, 0}',    // n
        "⠕": '{1, 0, 0, 1, 1, 0}',    // o
        "⠬": '{0, 1, 0, 0, 1, 1}',    // ó
        "⠏": '{1, 1, 1, 0, 1, 0}',    // p
        "⠟": '{1, 1, 1, 1, 1, 0}',    // q
        "⠗": '{1, 0, 1, 1, 1, 0}',    // r
        "⠎": '{0, 1, 1, 0, 1, 0}',    // s
        "⠞": '{0, 1, 1, 1, 1, 0}',    // t
        "⠥": '{1, 0, 0, 0, 1, 1}',    // u
        "⠾": '{0, 1, 1, 1, 1, 1}',    // ú
        "⠧": '{1, 0, 1, 0, 1, 1}',    // v
        "⠺": '{0, 1, 1, 1, 0, 1}',    // w
        "⠭": '{1, 1, 0, 0, 1, 1}',    // x
        "⠽": '{1, 1, 0, 1, 1, 1}',    // y
        "⠵": '{1, 0, 0, 1, 1, 1}',    // z

        // Sinais especiais
        "⠠": '{0, 0, 0, 0, 0, 1}',    // maiúscula (ponto 6)
        "⠼": '{0, 1, 0, 1, 1, 1}',    // número (pontos 3,4,5,6)

        //pontuação
        "⠲": "{0, 0, 1, 1, 0, 1}",
        "⠂": "{0, 0, 1, 0, 0, 0}",
        "⠆": "{0, 0, 1, 0, 1, 0}",
        "⠒": "{0, 0, 1, 1, 0, 0}",
        "⠖": "{0, 0, 1, 1, 1, 0}",
        "⠦": "{0, 0, 1, 0, 1, 1}",
        "⠐⠣": "{0, 0, 0, 1, 0, 0}, {1, 0, 1, 0, 0, 1}",
        "⠐⠜": "{0, 0, 0, 1, 0, 0}, {0, 1, 0, 1, 1, 0}",
        "⠤": "{0, 0, 0, 0, 1, 1}",
        "⠄": "{0, 0, 0, 0, 1, 0}",
        "⠶": "{0, 0, 1, 1, 1, 1}",
        "⠌": "{0, 1, 0, 0, 1, 0}",
        "⠈⠁": "{0, 1, 0, 0, 0, 0}, {1, 0, 0, 0, 0, 0}",
        "⠀": "{0, 0, 0, 0, 0, 0}"
    };

    var resultado = '{';

    result.split('').map((char) => {
        resultado += brailleToBinary[char]
        resultado += ','
    })
    resultado += '};'
    console.log(resultado);
    return resultado
}