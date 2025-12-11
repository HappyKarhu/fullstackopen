import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Typography, Card, CardContent } from "@mui/material";
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import TransgenderIcon from '@mui/icons-material/Transgender';
import { Gender, Patient, Diagnosis } from "../types";


interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage: React.FC<Props> = ({ diagnoses }) => {
  const { id } = useParams();
  const [patient, setPatient] = useState<Patient | null>(null);

    useEffect(() => {
        const fetchPatient = async () => {
            const { data} = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
            setPatient(data);
        };
        void fetchPatient();
    }, [id]);

    if (!patient) {
        return <div>Loading...</div>;
    }

    //here to pick gender icon
    const GenderIcon = () => {
  switch (patient.gender) {
    case Gender.Male:
      return <MaleIcon />;
    case Gender.Female:
      return <FemaleIcon />;
    default:
      return <TransgenderIcon />;
  }
};

    return (
        <div>
            <Typography variant="h4" style={{ marginBottom: "1em" }}>
                <br></br>
                {patient.name} <GenderIcon />
            </Typography>
            <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography><strong>SSN:</strong> {patient.ssn}</Typography>
          <Typography><strong>Occupation:</strong> {patient.occupation}</Typography>
          
        </CardContent>
      </Card>

      

      {patient.entries?.map(entry => (
        <Card key={entry.id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{entry.date}</Typography>
            <Typography>{entry.description}</Typography>
            {entry.diagnosisCodes && (
                <ul>
                  {entry.diagnosisCodes.map(code => {
                    const diagnosis = diagnoses.find(d => d.code === code);
                    return <li key={code}>{code} {diagnosis ? diagnosis.name : ""}</li>;
                  })}
                </ul>
              )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default PatientPage;