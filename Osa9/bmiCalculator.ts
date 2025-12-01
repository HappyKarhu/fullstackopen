export const calculateBmi = (heightInCm: number, weightKg: number): string => {
  const heightInM = heightInCm / 100;
  const bmi = weightKg / (heightInM * heightInM);

  if (bmi < 16) {
    return 'Underweight (Severe thinness)';
  } else if (bmi >= 16 && bmi < 17) {
    return 'Underweight (Moderate thinness)';
  } else if (bmi >= 17 && bmi < 18.5) {
    return 'Underweight (Mild thinness)';
  } else if (bmi >= 18.5 && bmi < 25) {
    return 'Normal range';
  } else if (bmi >= 25 && bmi < 30) {
    return 'Overweight (Pre-obese)';
  } else if (bmi >= 30 && bmi < 35) {
    return 'Obese (Class I)';
  } else if (bmi >= 35 && bmi < 40) {
    return 'Obese (Class II)';
  } else {
    return 'Obese (Class III)';
  }
};

//command line arguments processing
if (require.main === module) {
const parseArguments = (args: string[]): { height: number; weight: number } => {
  if (args.length < 4) throw new Error('Not enough arguments, please provide exactly 2 arguments: height (cm) and weight (kg)');
  const height = Number(args[2]);
  const weight = Number(args[3]);
  if (isNaN(height) || isNaN(weight)) throw new Error('Provided values were not numbers!');
  return { height, weight };
};

//run the program with command line arguments
try {
  const { height, weight } = parseArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) errorMessage += ' Error: ' + error.message;
    console.log(errorMessage);
  }
}