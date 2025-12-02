import express from 'express';
const app = express();
app.use(express.json());

const PORT = 3000;

app.get('/api/ping', (_req, res) => {
  console.log('someone pinged here');
  res.send('pong.');
});

app.get('/api/patients', (_req, res) => {
  res.send([]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});