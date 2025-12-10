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
export interface Entry {

}

export interface Patient {
    id:string
    name: string
    dateOfBirth: string
    ssn: string 
    gender: Gender
    occupation: string
    entries: Entry[]
}

export type PatientNossn = Omit<Patient, 'ssn'>;
export type AddPatientEntry = Omit<Patient, 'id' | 'entries'>;
export type NonSensitivePatient = Omit<Patient, 'ssn' | 'entries'>;