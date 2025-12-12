import { HospitalEntry, OccupationalHealthcareEntry, Entry } from "../types";
import { Typography } from "@mui/material";
import LocalHospitalTwoToneIcon from '@mui/icons-material/LocalHospitalTwoTone'; //hospital visit
import WorkTwoToneIcon from '@mui/icons-material/WorkTwoTone'; // occupational healthcare



const EntryDetails = ({entry} : {entry: Entry}) => {
    switch (entry.type) {
        case "Hospital":
            return <HospitalEntryDetails entry={entry} />;

        case "OccupationalHealthcare":
            return <OccupationalHealthcareEntryDetails entry={entry} />;

        default:
            return null; // OK if all cases handled to skip HealthCheckEntry for now
  }
};
        

//Hospital entry rendering
const HospitalEntryDetails= ({entry} : {entry: HospitalEntry}) => (
    <>
        <Typography variant="h6">
        <LocalHospitalTwoToneIcon /> {entry.date}
        </Typography>
        <Typography>{entry.description}</Typography>
        <Typography>
        Discharge: {entry.discharge.date} – {entry.discharge.criteria}
        </Typography>
  </>
);

// Occupational-job Healthcare entry rendering
const OccupationalHealthcareEntryDetails = ({ entry }: { entry: OccupationalHealthcareEntry }) => (
  <>
    <Typography variant="h6">
      <WorkTwoToneIcon /> {entry.date} – {entry.employerName}
    </Typography>
    <Typography>{entry.description}</Typography>
    {entry.sickLeave && (
      <Typography>
        Sick leave: {entry.sickLeave.startDate} to {entry.sickLeave.endDate}
      </Typography>
    )}
  </>
);

export default EntryDetails;