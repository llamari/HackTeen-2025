const express = require('express');
const swaggerUi = require('swagger-ui-express');
const { GetUsers, SignUp, SignIn, Delete, ForgotPassword, Verify, NewPassword } = require('./users');
const verifyToken = require('./middleware');
const { TextToSound, Summarise, YourTexts } = require('./tts');
const cors = require('cors');
const app = express();
const port = 5000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(require('../docs/swagger.json')));

const allowedOrigins = ['http://localhost:3000', 'http://localhost:8081'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    GetUsers(req, res);
})

app.post('/signup', (req, res) => {
    SignUp(req, res);
})

app.put('/signin', (req, res) => SignIn(req, res));

app.delete('/delete', verifyToken, (req, res) => Delete(req, res));

app.put('/forgot/password', (req, res) => ForgotPassword(req, res));

app.put('/verify/code', (req, res) => Verify(req, res));

app.put('/new/password', (req, res) => NewPassword(req, res));

app.post('/texttosound', verifyToken, (req, res) => {
    TextToSound(req, res);
})

app.post('/summarize', verifyToken, (req, res) => {
    Summarise(req, res)
});

app.get('/yourtexts', verifyToken, (req, res) => {
    YourTexts(req, res);
})

app.listen(port, (req, res) => {
    console.log(`Ouvindo na porta http://localhost:${port}`);
})