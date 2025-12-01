import express, { Request, Response } from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
app.use(express.json());

//hello endpoint
app.get('/hello', (_req: Request, res: Response) => {
  res.send('Hello Full Stack!');
});


//bmi calvculator endpoint
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

//excercise calculator endpoint
app.post('/exercises', (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { daily_exercises, target } =req.body;
    if (!daily_exercises || target === undefined) {
      return res.status(400).json({ error: 'parameters missing' });
    }

    //valideta numeric array and target
    if (!Array.isArray(daily_exercises) || daily_exercises.some((n: any) => isNaN(Number(n))) || isNaN(Number(target))) {
        return res.status(400).json({ error: 'malformatted parameters' });
    }
    const result = calculateExercises(daily_exercises.map((n: any) => Number(n)), Number(target));
    return res.json(result);
});


const PORT = 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});