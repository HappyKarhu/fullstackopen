export interface Diagnosis {
  code: string
  name: string
  latin?: string // their properties are optional
}

export enum Gender { //Enum ensures only 'male' | 'female' | 'other' are allowed
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export interface Patient {
    id:string
    name: string
    dateOfBirth: string
    ssn: string 
    gender: Gender
    occupation: string
}

export type PatientNossn = Omit<Patient, 'ssn'>;
export type AddPatientEntry = Omit<Patient, 'id'>;