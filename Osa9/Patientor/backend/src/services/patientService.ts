import patients from '../../data/patients';
import { Patient, PatientNossn, AddPatientEntry, Entry } from '../types';
import { v1 as uuid } from 'uuid';

const getPatients = (): Patient[] => {
  return patients;
};

const getPatientNossn = (): PatientNossn[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation, entries }) => ({
    id,
    name,   
    dateOfBirth,
    gender,
    occupation,
    entries
    }));
};

const addPatient = ( entry: AddPatientEntry ): Patient => {
  const newPatient = {
    id: uuid(),
    entries: [],
    ...entry
  };

  patients.push(newPatient);
  return newPatient;
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addEntry = (patientId: string, entry: Entry): Entry => {
  const patient = getPatientById(patientId);
  if (!patient) {
    throw new Error('Patient not found');
  }
  patient.entries.push(entry);
  return entry;
};


export default {
  getPatients,
  getPatientNossn,
  addPatient,
  getPatientById,
  addEntry
};