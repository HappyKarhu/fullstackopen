import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Route, Link as RouterLink, Routes } from "react-router-dom";
import { Button, Divider, Container, Typography } from '@mui/material';

import { apiBaseUrl } from "./constants";
import { Patient, Diagnosis } from "./types";
import DiagnosisService from "./services/diagnoses";

import patientService from "./services/patients";
import PatientListPage from "./components/PatientListPage";
import PatientPage from "./components/PatientPage";

const App = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  useEffect(() => {
    void axios.get<void>(`${apiBaseUrl}/ping`);

    const fetchPatientList = async () => {
      const patients = await patientService.getAll();
      setPatients(patients);
    };
    void fetchPatientList();
  }, []);

  useEffect(() => {
    const fetchDiagnosesList = async () => {
      const diagnoses = await DiagnosisService.getAll();
      setDiagnoses(diagnoses);
    };
    void fetchDiagnosesList();
  }, []);

  
  return (
    <div className="App">
      <Router>
        <Container>
          <Typography variant="h3" style={{ marginBottom: "0.5em" }}>
            Patientor
          </Typography>
          <Button component={RouterLink} to="/" variant="contained" color="primary">
            Home
          </Button>
          <Divider />
          <Routes>
            <Route path="/" element={
              <PatientListPage 
              patients={patients} 
              setPatients={setPatients} 
              />} 
            />
            {/*routse for a single patient*/}
            <Route path="/patients/:id" element={<PatientPage diagnoses={diagnoses}/>} />
          </Routes>
        </Container>
      </Router>
    </div>
  )
};

export default App;
