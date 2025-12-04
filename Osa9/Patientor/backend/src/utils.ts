// Validating requests is for validation purposes only
import {z} from 'zod';
import { Gender, AddPatientEntry } from './types';

const newPatientEntrySchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

export const toNewPatientEntry = (object: unknown): AddPatientEntry => {
    return newPatientEntrySchema.parse(object);
}