# 🚀 **IncluSound – HackTeen-2025**

## 📌 **Sobre o Projeto**
O mundo é composto por pessoas distintas que se comunicam e interagem com as informações de maneiras diversas, seja por **preferência ou necessidade**. O acesso ao conhecimento é um **direito de todos**, mas nem sempre as informações são transmitidas de maneira acessível.

A **IncluSound** é uma startup que transforma **palavras em voz**, garantindo que cada pessoa, independentemente de sua forma de comunicação, possa acessar a informação de maneira **livre e inclusiva**.

Nosso objetivo é **eliminar barreiras** e tornar o conhecimento acessível para todos, utilizando **tecnologia de conversão de texto em áudio** e explorando novas formas de inclusão digital.

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
    nodemon server.js
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

🔹 📝 Resumo Inteligente de Textos: Utiliza node-summary para criar versões compactas dos textos, facilitando a compreensão.

🔹 🔒 Autenticação Segura: Implementação de cadastro e login com autenticação JWT, garantindo segurança aos usuários.

---

## 📄 **Documentação da API**

📌 A API segue o padrão REST e está documentada no Swagger.

✅ Acesse a documentação Swagger: 🔗 [CLIQUE AQUI](docs/swagger.json)

---

### Endpoints Principais

| Método | Rota | Descrição |
| ------------- | ------------- | ------------- |
| POST  | /texttosound  | Converte um texto em áudio |
| POST  | /summarize  | Resume um texto automaticamente |
| POST | /signup | Registra um novo usuário |
| PUT | /signin | Autentica um usuário existente |
| GET | /yourtexts | Lista os textos processados pelo usuário |

---

## 🚀 **Roadmap e Melhorias Futuras**

🔹 Implementação de inteligência artificial para personalização do usuário.

🔹 Tradução para Libras e exploração de Braile digital.

🔹 Ajustes na qualidade do áudio e entonação.

🔹 Expansão da acessibilidade para novos formatos.

---

## 💠 **Tecnologias utilizadas**

🔹 **Node.js + Express.js** → Escolhemos **Node.js** por sua eficiência em operações assíncronas e escalabilidade para múltiplas requisições simultâneas. A utilização de **Express.js** facilita a organização das rotas REST, permitindo uma estrutura modular e expansível.  

🔹 **JWT (JSON Web Token)** → Implementamos **JWT** para autenticação segura, garantindo sessões protegidas sem necessidade de consultas frequentes ao banco de dados.  

🔹 **node-gtts (Google Text-to-Speech)** → Utilizamos **Google Text-to-Speech (gTTS)** para conversão de texto em áudio, garantindo suporte a múltiplos idiomas e alta qualidade sonora com fácil implementação via NPM.  

🔹 **node-summary** → Integramos **node-summary** para criação de resumos automáticos, facilitando o consumo de grandes quantidades de texto de forma compacta e compreensível com fácil implementação via NPM.  

🔹 **SQLite + Sequelize** → O projeto utiliza **SQLite** para armazenar os dados localmente, garantindo rapidez e portabilidade, combinado com **Sequelize** para gerenciamento ORM, facilitando consultas e manipulação de dados.  


[![My Skills](https://skillicons.dev/icons?i=nodejs,npm,sqlite,sequelize&theme=light)](https://skillicons.dev)

---

## 📝 **Documentação Swagger**

O *Swagger* é um tipo de documentação em que descreve as rotas da nossa API. Ele é como se fosse um "manual" de como utilizar cada rota da API, como os campos que devem ser inseridos no corpo da requisição, exemplos de como se deve preencher esse campos, além dos tipos de dados dos campos.

Essa documentação é de extensão *.JSON* que tem como característica pares de chave-valor.

Você pode acessar a documentação do projeto através da pasta *Docs* do repositório, que esta nomeada como *swagger.json*. Ou então lê-lo a seguir:

Abaixo segue a *Documentação Swagger da API IncluSound*!


  ```bash
{
    "openapi": "3.0.3",
    "info": {
        "title": "HackTeen 2025 API",
        "version": "1.0.0",
        "description": "Documentação da API do projeto HackTeen 2025"
    },
    "servers": [
        {
            "url": "http://localhost:5000",
            "description": "Servidor local"
        }
    ],
    "tags": [
        {
            "name": "Auth",
            "description": "Rotas de autenticação e usuários"
        },
        {
            "name": "Text",
            "description": "Rotas de processamento de texto"
        }
    ],
    "paths": {
        "/": {
            "get": {
                "tags": [
                    "Auth"
                ],
                "summary": "Lista todos os usuários",
                "description": "Retorna todos os usuários cadastrados.",
                "responses": {
                    "200": {
                        "description": "Lista de usuários retornada com sucesso",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "type": "object",
                                        "properties": {
                                            "id": {
                                                "type": "integer"
                                            },
                                            "email": {
                                                "type": "string"
                                            }
                                        }
                                    },
                                    "examples": {
                                        "success": {
                                            "value": [
                                                {
                                                    "id": 1,
                                                    "email": "usuario1@exemplo.com"
                                                },
                                                {
                                                    "id": 2,
                                                    "email": "usuario2@exemplo.com"
                                                }
                                            ]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/signup": {
                "post": {
                    "tags": [
                        "Auth"
                    ],
                    "summary": "Registra um novo usuário",
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "email",
                                        "password"
                                    ],
                                    "properties": {
                                        "email": {
                                            "type": "string"
                                        },
                                        "password": {
                                            "type": "string"
                                        }
                                    }
                                },
                                "example": {
                                    "email": "usuario@exemplo.com",
                                    "password": "senhaSegura123"
                                }
                            }
                        }
                    },
                    "responses": {
                        "201": {
                            "description": "Usuário registrado com sucesso",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "message": {
                                                "type": "string"
                                            },
                                            "user": {
                                                "type": "object",
                                                "properties": {
                                                    "id": {
                                                        "type": "integer"
                                                    },
                                                    "email": {
                                                        "type": "string"
                                                    }
                                                }
                                            }
                                        }
                                    },
                                    "examples": {
                                        "success": {
                                            "value": {
                                                "message": "Usuário registrado com sucesso",
                                                "user": {
                                                    "id": 1,
                                                    "email": "usuario@exemplo.com"
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "400": {
                            "description": "Erro na validação dos dados",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "error": {
                                                "type": "string"
                                            }
                                        }
                                    },
                                    "examples": {
                                        "invalidEmail": {
                                            "value": {
                                                "error": "O email fornecido não é válido"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/signin": {
                "put": {
                    "tags": [
                        "Auth"
                    ],
                    "summary": "Faz login de um usuário",
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "email",
                                        "password"
                                    ],
                                    "properties": {
                                        "email": {
                                            "type": "string"
                                        },
                                        "password": {
                                            "type": "string"
                                        }
                                    }
                                },
                                "example": {
                                    "email": "usuario@exemplo.com",
                                    "password": "senhaSegura123"
                                }
                            }
                        }
                    },
                    "responses": {
                        "200": {
                            "description": "Login bem-sucedido",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "message": {
                                                "type": "string"
                                            },
                                            "token": {
                                                "type": "string"
                                            }
                                        }
                                    },
                                    "examples": {
                                        "success": {
                                            "value": {
                                                "message": "Login bem-sucedido",
                                                "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImV4cCI6MTYyODg3NzYwMX0.6kUJdxk_wfh7DdYhTqT8GVXXd04-K35UkK73D7h4ZPQ"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "401": {
                            "description": "Credenciais inválidas",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "error": {
                                                "type": "string"
                                            }
                                        }
                                    },
                                    "examples": {
                                        "invalidCredentials": {
                                            "value": {
                                                "error": "Credenciais inválidas"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/delete": {
                "delete": {
                    "tags": [
                        "Auth"
                    ],
                    "summary": "Remove um usuário",
                    "security": [
                        {
                            "bearerAuth": []
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Usuário removido com sucesso"
                        },
                        "401": {
                            "description": "Não autorizado"
                        }
                    }
                }
            },
            "/forgot/password": {
                "put": {
                    "tags": [
                        "Auth"
                    ],
                    "summary": "Solicita redefinição de senha",
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "email"
                                    ],
                                    "properties": {
                                        "email": {
                                            "type": "string"
                                        }
                                    },
                                    "example": {
                                        "email": "usuario@exemplo.com"
                                    }
                                }
                            }
                        }
                    },
                    "responses": {
                        "200": {
                            "description": "Código enviado com sucesso",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "message": {
                                                "type": "string"
                                            }
                                        }
                                    },
                                    "examples": {
                                        "success": {
                                            "value": {
                                                "message": "Código de redefinição enviado com sucesso"
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        "404": {
                            "description": "Usuário não encontrado",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "object",
                                        "properties": {
                                            "error": {
                                                "type": "string"
                                            }
                                        }
                                    },
                                    "examples": {
                                        "userNotFound": {
                                            "value": {
                                                "error": "Usuário não encontrado"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            "/verify/code": {
                "put": {
                    "tags": [
                        "Auth"
                    ],
                    "summary": "Verifica código de redefinição de senha",
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "code"
                                    ],
                                    "properties": {
                                        "code": {
                                            "type": "string",
                                            "example": "123456"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "responses": {
                        "200": {
                            "description": "Código válido"
                        },
                        "400": {
                            "description": "Código inválido"
                        }
                    }
                }
            },
            "/new/password": {
                "put": {
                    "tags": [
                        "Auth"
                    ],
                    "summary": "Redefine a senha do usuário",
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "password"
                                    ],
                                    "properties": {
                                        "password": {
                                            "type": "string",
                                            "example": "novaSenha123"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "responses": {
                        "200": {
                            "description": "Senha redefinida com sucesso"
                        },
                        "400": {
                            "description": "Erro na redefinição da senha"
                        }
                    }
                }
            },
            "/texttosound": {
                "post": {
                    "tags": [
                        "Text"
                    ],
                    "summary": "Converte texto em áudio",
                    "security": [
                        {
                            "bearerAuth": []
                        }
                    ],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "text"
                                    ],
                                    "properties": {
                                        "text": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "responses": {
                        "200": {
                            "description": "Áudio gerado com sucesso"
                        },
                        "400": {
                            "description": "Erro na conversão"
                        }
                    }
                }
            },
            "/summarize": {
                "post": {
                    "tags": [
                        "Text"
                    ],
                    "summary": "Resume um texto",
                    "security": [
                        {
                            "bearerAuth": []
                        }
                    ],
                    "requestBody": {
                        "required": true,
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "required": [
                                        "text"
                                    ],
                                    "properties": {
                                        "text": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "responses": {
                        "200": {
                            "description": "Resumo gerado com sucesso"
                        },
                        "400": {
                            "description": "Erro ao gerar o resumo"
                        }
                    }
                }
            },
            "/yourtexts": {
                "get": {
                    "tags": [
                        "Text"
                    ],
                    "summary": "Lista textos do usuário",
                    "security": [
                        {
                            "bearerAuth": []
                        }
                    ],
                    "responses": {
                        "200": {
                            "description": "Lista retornada com sucesso",
                            "content": {
                                "application/json": {
                                    "schema": {
                                        "type": "array",
                                        "items": {
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        },
                        "401": {
                            "description": "Não autorizado"
                        }
                    }
                }
            }
        },
        "components": {
            "securitySchemes": {
                "bearerAuth": {
                    "type": "http",
                    "scheme": "bearer",
                    "bearerFormat": "JWT"
                }
            }
        }
    }
}
  ```


---


## 👥 **Autores do Projeto**

- Sara Lamari Silva
- Thiago Lameiras de Mattos
- Maria Júlia da Silva Araújo
- Beatriz Vinguerti Xavier


