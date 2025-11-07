// src/components/dashboard/ReportsPage.jsx
import React from 'react'
import { Typography, Box, Chip } from '@mui/material'
import Patient from './Patient/Patient'

const persons = [
	{
		id: 1,
		name: 'John Doe',
		age: 30,
		condition: 'Healthy',
	},
	{
		id: 2,
		name: 'Jane Smith',
		age: 25,
		condition: 'Flu',
	},
	{
		id: 3,
		name: 'Sam Johnson',
		age: 40,
		condition: 'Diabetes',
	},
]

function Patients() {
	return (
		<Box>
			<Typography variant='h4' component='h1' gutterBottom sx={{ fontWeight: 600 }}>
				Lista Pacjentów
			</Typography>
			<Typography variant='body1' color='text.secondary'>
				{persons.map(person => (
					<Patient key={person.id} name={person.name} age={person.age} condition={person.condition} />
				))}
			</Typography>
		</Box>
	)
}

export default Patients
