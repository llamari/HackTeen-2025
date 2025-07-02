# 🚀 **IncluSound – ETEC Bento Quirino**



### Índice
- [Sobre](#-sobre-o-projeto)
- [Vídeo de Apresentação](#-vídeo-de-apresentação)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Como Instalar e Rodar](#-como-instalar-e-rodar)
- [Funcionalidades](#-funcionalidades)
- [Documentação da API](#-documentação-da-api)
- [Endpoints Principais](#endpoints-principais)
- [Roadmap e Melhorias Futuras](#-roadmap-e-melhorias-futuras)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Autores do Projeto](#-autores-do-projeto)




## 📌 **Sobre o Projeto**
O mundo é composto por pessoas distintas que se comunicam e interagem com as informações de maneiras diversas, seja por **preferência ou necessidade**. O acesso ao conhecimento é um **direito de todos**, mas nem sempre as informações são transmitidas de maneira acessível.

A **IncluSound** é uma startup que transforma **palavras em voz e em escrita Braille**, garantindo que cada pessoa, independentemente de sua forma de comunicação, possa acessar a informação de maneira **livre e inclusiva**.

Nosso objetivo é **eliminar barreiras** e tornar o conhecimento acessível para todos, utilizando **tecnologia de conversão de texto** e explorando novas formas de inclusão digital.

---

## 📹 **Vídeo de Apresentação**
📌 **Confira nosso vídeo de apresentação para entender melhor nossa missão e impacto:**  
🔗 [Link para o vídeo](https://drive.google.com/file/d/1QuJRXKtw6HG32_TSYoRTWFBetbi_uI9v/view?usp=sharing)

---

## 📂 **Estrutura do Projeto**

📁 backend/ → Código do servidor e lógica da aplicação  
📁 frontend_web/ → Interface web do usuário  
📁 frontend_mobile/ → Aplicação mobile  
📁 docs/ → Documentação e guias de uso  

---

## 🛠 **Como Instalar e Rodar**

### **Clone o repositório:**

  ```bash
  git clone https://github.com/llamari/HackTeen-2025.git
  cd HackTeen-2025
  ```

### **Backend**
1️⃣ **Criar um arquivo `.env`** baseado no `exemplo.env`.  
2️⃣ **Instalar dependências**: 

  ```bash
   npm install
  ```

3️⃣ **Iniciar o servidor**:

  ```bash
    npm start
  ```

### **Frontend Web**
1️⃣ Instalar dependências:

  ```bash
    npm install
  ```

2️⃣ Iniciar o projeto:

  ```bash
    npm start
  ```

### **Frontend Mobile**
1️⃣ Instalar dependências:

  ```bash
    npm install
  ```

2️⃣ Rodar no navegador:

  ```bash
    npx expo start --web
  ```

---

## 📡 **Funcionalidades**

🔹 🚀 Conversão de Texto para Áudio: Transforma qualquer texto em áudio com alta qualidade usando node-gtts.

🔹 ⠿ Conversão de Texto para Braille e Braille para Texto: Transforma qualquer texto em braille ou braille em texto utilizando um sistema de mapeamento de pontos Braille.

🔹 📸 Descrição de Imagem: Descreve detalhadamente imagens, inclusive as que possuem algum texto, este também é apresentado.

🔹 📝 Resumo Inteligente de Textos: Utiliza uma API do Gemini 1.5 Flash para criar versões compactas dos textos, facilitando a compreensão.

🔹 🔒 Autenticação Segura: Implementação de cadastro e login com autenticação JWT, garantindo segurança aos usuários.

---

## 📄 **Documentação da API**

📌 A API segue o padrão REST e está documentada no Swagger.

✅ Acesse a documentação Swagger: 🔗 [Clique Aqui](docs/swagger.json)

---

### Endpoints Principais

| Método | Rota | Descrição |
| ------------- | ------------- | ------------- |
| POST  | /tts/ | Converte um texto em áudio |
| POST  | /tts/summarize  | Resume um texto automaticamente |
| POST | /tts/describeImage | Descreve uma imagem em texto |
| POST | /tts/textToBraille | Converte o texto recebido em Braille Unicode Grau 1 |
| POST | /tts/brailleToText | Converte Braille Unicode Grau 1 em texto |
| POST | /tts/brailleDisplay | Converte o texto recebido em um json com os pontos para o Display Braille|
| GET | /tts/yourtexts | Retorna todos os textos já enviados pelo usuário |
| GET | /users/ | Retorna todos os usuários cadastrados |
| POST | /users/signup | Registra um novo usuário |
| PUT | /users/signin | Autentica um usuário existente |
| DELETE | /users/delete | Excluí um usuário |
| PUT | /users/forgot/password | Usuário envia seu e-mail para receber código de alteração da sua senha |
| PUT | /users/verify/code | Autentica o código inserido pelo usuário para alteração de senha |
| PUT | /users/new/password | Usuário insere uma nova senha |


---

## 🚀 **Roadmap e Melhorias Futuras**

🔹 Tradução para Libras.

🔹 Ajustes na qualidade do áudio e entonação.

🔹 Expansão da acessibilidade para novos formatos.

---

## 💠 **Tecnologias utilizadas**

🔹 **Node.js + Express.js** → Escolhemos **Node.js** por sua eficiência em operações assíncronas e escalabilidade para múltiplas requisições simultâneas. A utilização de **Express.js** facilita a organização das rotas REST, permitindo uma estrutura modular e expansível.  

🔹 **JWT (JSON Web Token)** → Implementamos **JWT** para autenticação segura, garantindo sessões protegidas sem necessidade de consultas frequentes ao banco de dados.  

🔹 **node-gtts (Google Text-to-Speech)** → Utilizamos **Google Text-to-Speech (gTTS)** para conversão de texto em áudio, garantindo suporte a múltiplos idiomas e alta qualidade sonora com fácil implementação via NPM.  

🔹 **React.js** → O frontend web foi construído utilizando **React.js.**

🔹 **API do Gemini 1.5 Flash** → O sistema utiliza a API do **Gemini 1.5 Flash** para fazer resumos de textos e descrição de imagens.

🔹 **SQLite + Sequelize** → O projeto utiliza **SQLite** para armazenar os dados localmente, garantindo rapidez e portabilidade, combinado com **Sequelize** para gerenciamento ORM, facilitando consultas e manipulação de dados.  


[![My Skills](https://skillicons.dev/icons?i=nodejs,npm,sqlite,sequelize&theme=light)](https://skillicons.dev)

![React](https://img.shields.io/badge/React-2025-blue)
![Acessibilidade](https://img.shields.io/badge/A11Y-ready-green)


---

## 👥 **Autores do Projeto**

- Sara Lamari Silva
- Thiago Lameiras de Mattos
- Maria Júlia da Silva Araújo
- Beatriz Vinguerti Xavier


