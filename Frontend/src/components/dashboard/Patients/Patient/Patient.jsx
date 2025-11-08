// src/components/dashboard/Patients/Patient/Patient.jsx
import { Chip } from '@mui/material'

const Patient = ({ firstName, lastName, dob, gender, onClick }) => {
	return (
		<>
			<Chip
				label={`Pacjent: ${firstName} ${lastName}, Data Urodzenia: ${dob}, Płeć: ${gender}`}
				variant='outlined'
				sx={{ margin: '5px', cursor: 'pointer' }} // Kursywa wskazuje klikalność
				onClick={onClick} // Przekazanie kliknięcia do rodzica
			/>
		</>
	)
}

export default Patient