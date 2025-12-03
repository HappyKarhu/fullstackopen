import patients from '../../data/patients';
import { Patient, PatientNossn } from '../types';

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

export default {
  getPatients,
  getPatientNossn
};