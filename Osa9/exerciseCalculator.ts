//The result interface is returned by calculateExercises function
interface ExerciseResult {
  periodLength: number; //the number of days
  trainingDays: number; //the number of training days
  success: boolean; //the original target value
  rating: number; //a rating between the numbers 1-3 that tells how well the hours are met
  ratingDescription: string; //a text value explaining the rating
  target: number; //boolean value describing if the target was reached
  average: number; //the calculated average time
}



export const calculateExercises = (dailyExercises: number[], target: number): ExerciseResult => {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter(day => day > 0).length;
  const totalHours = dailyExercises.reduce((sum, hours) => sum + hours, 0);
  const average = totalHours / periodLength;
  const success = average >= target;

  //rating logic
  let rating: number;
  let ratingDescription: string;

  if (average >= target) {
    rating = 1;
    ratingDescription = 'You exercised enought hours, your body is thankful. You can take a break';
  } else if (average >= target * 0.75) {
    rating = 2;
    ratingDescription = 'Not bad, but your goal is not reached, jet.';
  } else {
    rating = 3;
    ratingDescription = 'You forgot that exercise is important, your body needs it.';
  }

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

const parseArguments = (args: string[]): { dailyExercises: number[], target: number } => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const numberArgs = args.slice(2).map(arg => Number(arg));
    if (numberArgs.some(isNaN)) {
      throw new Error('Provided values were not numbers!');
    }
  const target = numberArgs[0];
  const dailyExercises = numberArgs.slice(1); 
  return { dailyExercises, target };
}

//run the program with command line arguments
try {
  const { dailyExercises, target } = parseArguments(process.argv);
  const result=(calculateExercises(dailyExercises, target));
  console.log(result);
} catch (error: unknown) {
  let errorMessage = 'Something went wrong.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}