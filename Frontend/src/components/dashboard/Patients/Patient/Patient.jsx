// src/components/dashboard/Patients/Patient/Patient.jsx
import { Chip } from '@mui/material'

const Patient = ({ firstName, lastName, dob, gender }) => {
	return (
		<>
			<Chip
				label={`Pacjent: ${firstName} ${lastName}, Data Urodzenia: ${dob}, Płeć: ${gender}`}
				variant='outlined'
				sx={{ margin: '5px' }}
			/>
		</>
	)
}

export default Patient