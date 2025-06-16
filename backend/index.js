import app from './server.js';

const port = 5000;

app.listen(port, () => {
  console.log(`Ouvindo na porta http://localhost:${port}`);
});
