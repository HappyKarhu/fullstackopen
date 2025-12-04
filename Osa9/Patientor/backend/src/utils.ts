// Validating requests is for validation purposes only

import { Gender, AddPatientEntry } from './types';

// string validation
const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
}

//gender validation, because only genger is not string but enum
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param as Gender);
}

// parsing function for each field
export const parseName = (name: unknown): string => {
    if (!isString(name)) throw new Error('Incorrect or missing name');
    return name;
}

export const parseDateOfBirth = (dateOfBirth: unknown): string => {
    if (!isString(dateOfBirth)) throw new Error('Incorrect or missing date of birth');
    return dateOfBirth;
}

export const parseSsn = (ssn: unknown): string => {
    if (!isString(ssn)) throw new Error('Incorrect or missing ssn');
    return ssn;
}

export const parseGender = (gender: unknown): Gender => {
    if (!isString(gender) || !isGender(gender)) throw new Error('Incorrect or missing gender');
    return gender;
}

export const parseOccupation = (occupation: unknown): string => {
    if (!isString(occupation)) throw new Error('Incorrect or missing occupation');
    return occupation;
}

//check-safe parser fro new patient entries
export const toNewPatientEntry = (object: any): AddPatientEntry => {
    if (!object || typeof object !== 'object') throw new Error('Incorrect or missing data');

    if (
    'name' in object &&
    'dateOfBirth' in object &&
    'ssn' in object &&
    'gender' in object &&
    'occupation' in object
  ) {
    return {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
    }
  }

  throw new Error('Incorrect data: some fields are missing');
}