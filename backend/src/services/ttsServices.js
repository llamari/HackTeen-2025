import path from 'path';
import gTTS from 'gtts';
import { fileURLToPath } from 'url';
import axios from 'axios';
import { schema } from '../database/schema/index.js';
import { db } from '../database/connection.js';
import { describeImage, generateEmbeddings, summarizeText } from '../utils/gemini.js';
import { eq, sql } from 'drizzle-orm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const TextToSoundService = async (userId, text, language) => {
    const filename = `audio-${Date.now()}.mp3`;
    const filepath = path.join(__dirname, filename);

    try {
        const embeddings = await generateEmbeddings(text);

        console.log(embeddings.length);

        await db.insert(schema.texts).values({
            content: text,
            user_id: userId,
            embeddings: embeddings
        });
    } catch (error) {
        throw { type: 'db', message: 'Erro ao salvar texto no banco.', error: error };
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
        const result = await summarizeText(text);

        if (!result) {
            throw { type: 'api', message: 'Erro ao resumir o texto.' };
        }

        try {
            const embedding = await generateEmbeddings(result);

            await db.insert(schema.texts).values({
                content: result,
                user_id: userId,
                embeddings: embedding
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
        const result = await describeImage(imageBase64);

        if (!result) {
            throw { type: 'api', message: 'Erro ao descrever a imagem.' };
        }

        try {
            const embedding = await generateEmbeddings(result);

            await db.insert(schema.texts).values({
                content: result,
                user_id: userId,
                embeddings: embedding
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
    const texts = await db.select().from(schema.texts).where(
        eq(schema.texts.user_id, userId)
    );
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