export interface Diagnosis {
  code: string
  name: string
  latin?: string // their properties are optional
}

export interface Patient {
    id: String
    name: String
    dateOfBirth: String
    ssn: String 
    gender:string
    occupation: String
}

export type PatientNossn = Omit<Patient, 'ssn'>;