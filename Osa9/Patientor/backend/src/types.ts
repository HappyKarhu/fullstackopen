export interface Diagnosis {
  code: string
  name: string
  latin?: string // their properties are optional
}

export interface Patient {
    id:string
    name: string
    dateOfBirth: string
    ssn: string 
    gender:string
    occupation: string
}

export type PatientNossn = Omit<Patient, 'ssn'>;
export type AddPatientEntry = Omit<Patient, 'id'>;