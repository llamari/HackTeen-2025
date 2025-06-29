import { jest } from '@jest/globals';

jest.unstable_mockModule('../../services/ttsServices.js', () => ({
    TextToSoundService: jest.fn(),
    SummariseService: jest.fn(),
    YourTextsService: jest.fn(),
    BrailleService: jest.fn(),
    BrailleToTextService: jest.fn(),
    BrailleForDisplayService: jest.fn(),
    DescribeImageService: jest.fn()
})); //"mockar" antes de tudo

describe('Testes do TTS', () => {
    let TextToSound, Summarise, YourTexts, Braille, BrailleToText, BrailleForDisplay;
    let ttsServices;

    beforeEach(async () => {
        const controller = await import('../../controllers/ttsControllers.js'); //Conectar com os controllers
        TextToSound = controller.TextToSound;
        Summarise = controller.Summarise;
        YourTexts = controller.YourTexts;
        Braille = controller.Braille;
        BrailleToText = controller.BrailleToText;
        BrailleForDisplay = controller.BrailleForDisplay;
        DescribeImage = controller.DescribeImage;

        ttsServices = await import('../../services/ttsServices.js'); //Conectar com os services
    });

    const mockRequest = (body = {}, user = {}) => ({ body, user }); //requisição

    const mockResponse = () => { //resposta
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.send = jest.fn().mockReturnValue(res);
        res.download = jest.fn().mockReturnValue(res);
        return res;
    };

    afterEach(() => {
        jest.clearAllMocks(); //resetar pra nao dar erro
    });


    //Funcoes teste


    // TextToSound


    test('TextToSound deve retornar 200 e fazer download do arquivo', async () => {
        const req = mockRequest({ text: 'Teste', language: 'en' }, { id: 1 });
        const res = mockResponse();
        const fakeFilePath = 'fakepath.mp3';
        ttsServices.TextToSoundService.mockResolvedValue(fakeFilePath);
        await TextToSound(req, res);
        expect(res.download).toHaveBeenCalledWith(fakeFilePath, expect.any(Function));
    }); //Sucesso
    test('TextToSound deve retornar 400 se texto não for fornecido', async () => {
        const req = mockRequest({ language: 'pt' }, { id: 1 });
        const res = mockResponse();
        await TextToSound(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Texto não fornecido.' });
    }); //Falha 1
    test('TextToSound deve retornar 400 se idioma não for fornecido', async () => {
        const req = mockRequest({ text: 'Teste' }, { id: 1 });
        const res = mockResponse();
        await TextToSound(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Idioma não fornecido.' });
    }); //Falha 2
    test('TextToSound deve retornar 400 em erro do banco', async () => {
        const req = mockRequest({ text: 'Teste', language: 'pt' }, { id: 1 });
        const res = mockResponse();
        ttsServices.TextToSoundService.mockRejectedValue({ type: 'db', message: 'Erro ao salvar texto no banco.' });
        await TextToSound(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao salvar texto no banco.' });
    }); //Falha 3

    test('TextToSound deve retornar 500 em erro de áudio', async () => {
        const req = mockRequest({ text: 'Teste', language: 'pt' }, { id: 1 });
        const res = mockResponse();
        ttsServices.TextToSoundService.mockRejectedValue({ type: 'audio', message: 'Erro ao gerar áudio.' });
        await TextToSound(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao gerar áudio.' });
    }); //Falha 4

    test('TextToSound deve retornar 500 em erro inesperado', async () => {
        const req = mockRequest({ text: 'Teste', language: 'pt' }, { id: 1 });
        const res = mockResponse();
        ttsServices.TextToSoundService.mockRejectedValue(new Error('Erro desconhecido'));
        await TextToSound(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro inesperado.' });
    }); //Falha 5

    // Summarise
    test('Summarise deve retornar 200 e o resumo', async () => {
        const req = mockRequest({ text: 'Inclusão é mais do que aceitar, é abraçar. É entender que cada pessoa carrega uma história, um jeito único de existir, de sentir e de aprender. É quando enxergamos além das diferenças e percebemos que, no fundo, todos só querem pertencer, ser ouvidos e respeitados. Quando olhamos nos olhos do outro e dizemos: "Você importa, exatamente como é", construímos um mundo mais justo. Um mundo onde ninguém fica para trás, onde diversidade não é obstáculo, mas ponte. Porque cada voz tem valor, cada sonho merece espaço, e cada passo dado junto faz a caminhada mais bonita. Ser inclusivo não é favor, é amor em ação. É humanidade na sua forma mais pura e necessária.' });
        const res = mockResponse();
        const summary = 'Resumo do texto';
        ttsServices.SummariseService.mockResolvedValue(summary);
        await Summarise(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ summary });
    }); //Sucesso

    test('Summarise deve retornar 400 se texto não for string', async () => {
        const req = mockRequest({ text: 123 });
        const res = mockResponse();
        await Summarise(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Informação essencial faltando' });
    }); //Falha 1

    test('Summarise deve retornar 500 em erro do serviço', async () => {
        const req = mockRequest({ text: 'Texto' });
        const res = mockResponse();
        ttsServices.SummariseService.mockRejectedValue(new Error('Erro no serviço'));
        await Summarise(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro durante o resumo' });
    }); //Falha 2

    // YourTexts
    test('YourTexts deve retornar  200 e os textos do usuário', async () => {
        const req = mockRequest({}, { id: 42 });
        const res = mockResponse();
        const texts = [{ content: 'Texto 1' }, { content: 'Texto 2' }];
        ttsServices.YourTextsService.mockResolvedValue(texts);
        await YourTexts(req, res);
        expect(res.json).toHaveBeenCalledWith({ texts });
    }); // Sucesso
    test('YourTexts deve retornar 500 em erro inesperado', async () => {
        const req = mockRequest({}, { id: 42 });
        const res = mockResponse();
        const texts = [{ content: 'Texto 1' }, { content: 'Texto 2' }];
        ttsServices.YourTextsService.mockRejectedValue(new Error('Erro desconhecido'));
        await YourTexts(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro inesperado.' });
    }) //Falha 1

    // DescribeImage 
    test('DescribeImage deve retornar 200 e o resultado', async () => {
        const req = mockRequest({ imageBase64: 'data:image/jpeg;base64,fakeImage' })
        const res = mockResponse();
        ttsServices.DescribeImageService.mockResolvedValue('Imagem de um gato sorrindo');
        await DescribeImage(req, res);
        expect(res.json).toHaveBeenCalledWith({ description: 'Imagem de um gato sorrindo' });
    }); //Sucesso

    test('DescribeImage deve retornar 400 se não houver imagem ', async () => {
        const req = mockRequest({ imageBase64: '' })
        const res = mockResponse();
        await DescribeImage(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'A imagem é obrigatória.' });
    }); //Falha 1
    test('DescribeImage deve retornar 500 em erro do serviço ', async () => {
        const req = mockRequest({ imageBase64: 'data:image/jpeg;base64,fakeImage' })
        const res = mockResponse();
        ttsServices.DescribeImageService.mockRejectedValue(new Error("Erro ao processar imagem."));
        await DescribeImage(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao processar imagem.' });
    }); //Falha 2

    // Braille
    test('Braille deve retornar 200 e o resultado', async () => {
        const req = mockRequest({ text: 'abc' }, { id: 42 });
        const res = mockResponse();
        ttsServices.BrailleService.mockResolvedValue('⠁⠃⠉');
        await Braille(req, res);
        expect(res.send).toHaveBeenCalledWith({ result: '⠁⠃⠉' });
    }); //Sucesso

    test('Braille deve retornar 400 se caractere inválido', async () => {
        const req = mockRequest({ text: '❌' }, { id: 42 });
        const res = mockResponse();
        ttsServices.BrailleService.mockRejectedValue({ type: 'invalid', message: 'Caractere inválido' });
        await Braille(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Caractere inválido' });
    }); //Falha 1

    // BrailleToText
    test('BrailleToText deve retornar 200 e o resultado convertido', async () => {
        const req = mockRequest({ braille: '⠁' }, { id: 42 });
        const res = mockResponse();
        ttsServices.BrailleToTextService.mockResolvedValue('a');
        await BrailleToText(req, res);
        expect(res.send).toHaveBeenCalledWith({ result: 'a' });
    }); // Sucesso

    test('BrailleToText deve retornar 400 se caractere inválido', async () => {
        const req = mockRequest({ braille: '❌' }, { id: 42 });
        const res = mockResponse();
        ttsServices.BrailleToTextService.mockRejectedValue({ type: 'invalid', message: 'Caractere inválido' });
        await BrailleToText(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Caractere inválido' });
    }); //Falha

    // BrailleForDisplay
    test('BrailleForDisplay deve retornar 200 e o resultado', async () => {
        const req = mockRequest({ text: 'abc' }, { id: 42 });
        const res = mockResponse();
        ttsServices.BrailleForDisplayService.mockResolvedValue('braille-binary');
        await BrailleForDisplay(req, res);
        expect(res.send).toHaveBeenCalledWith({ result: 'braille-binary' });
    }); //Sucesso

    test('BrailleForDisplay deve retornar 400 se caractere inválido', async () => {
        const req = mockRequest({ text: '❌' }, { id: 42 });
        const res = mockResponse();
        ttsServices.BrailleForDisplayService.mockRejectedValue({ type: 'invalid', message: 'Caractere inválido' });
        await BrailleForDisplay(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Caractere inválido' });
    }); //Falha
});
