// Validating requests is for validation purposes only
import {z} from 'zod';
import { Gender, AddPatientEntry, Entry, HealthCheckRating } from './types';
import { v4 as uuid } from 'uuid'; //npm library to create unique ids

const newPatientEntrySchema = z.object({
  name: z.string(),
  dateOfBirth: z.string(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
});

export const toNewPatientEntry = (object: unknown): AddPatientEntry => {
    return newPatientEntrySchema.parse(object);
};

//osnovna shema for common fields
const baseEntrySchema = z.object({
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

//Hospital entry schema
const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.object({
    date: z.string(),
    criteria: z.string(),
  }),
});

//OccupationalHealthcare entry schema
const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z.object({
    startDate: z.string(),
    endDate: z.string(),
  }).optional(),
});

//HealthCheck entry schema
const healthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

//Union of all entry schemas
const entrySchema = z.union([
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
  healthCheckEntrySchema,
]);

export const toNewEntry = (object: unknown): Entry => {
  const entry = entrySchema.parse(object);
  return { ...entry, id: uuid() };
};
