import patients from '../../data/patients';
import { Patient, PatientNossn, AddPatientEntry } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const getPatientNossn = (): PatientNossn[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,   
    dateOfBirth,
    gender,
    occupation
    }));
}

const addPatient = ( entry: AddPatientEntry ): Patient => {
  const newPatient = {
    id: uuid(),
    ...entry
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getPatients,
  getPatientNossn,
  addPatient
};