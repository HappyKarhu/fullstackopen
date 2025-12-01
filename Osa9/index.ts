import express, { Request, Response } from 'express';
import { calculateBmi } from './bmiCalculator';

const app = express();

app.get('/hello', (_req: Request, res: Response) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req: Request, res: Response) => {
  const height = req.query.height;
  const weight = req.query.weight;

  if (!height || !weight || isNaN(Number(height)) || isNaN(Number(weight))) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const bmi = calculateBmi(Number(height), Number(weight));

  return res.json({
    height: Number(height),
    weight: Number(weight),
    bmi
  });
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});