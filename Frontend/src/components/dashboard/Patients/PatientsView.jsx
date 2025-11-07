// src/components/dashboard/Patients/Patients.jsx
import React, { useState, useEffect } from 'react'
import { Typography, Box, CircularProgress } from '@mui/material'
import Patient from './Patient/Patient'
// ========= ZMIANA TUTAJ: Importujemy axiosInstance z AuthContext =========
import { axiosInstance } from '../../../context/AuthContext'

// ========= ZMIANA TUTAJ: Usuwamy lokalną definicję axiosInstance =========
// const axiosInstance = axios.create({ ... })

function PatientsView() {
	const [patients, setPatients] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		// Funkcja do pobierania danych
		const fetchPatients = async () => {
			try {
				// Teraz to żądanie użyje instancji z interceptorami
				const response = await axiosInstance.get('/api/patients/') // Zakładając, że proxy /api jest skonfigurowane w vite.config.js
				setPatients(response.data || [])
			} catch (error) {
				console.error('There was an error fetching the patients!', error)
			} finally {
				setLoading(false)
			}
		}

		fetchPatients()
	}, []) // Pusta tablica zależności oznacza, że efekt uruchomi się tylko raz po zamontowaniu

	return (
		<Box>
			<Typography variant='h4' component='h1' gutterBottom sx={{ fontWeight: 600 }}>
				Lista Pacjentów
			</Typography>
			<Box>
				{loading ? (
					<CircularProgress />
				) : patients.length > 0 ? (
					patients.map(patient => (
						<Patient
							key={patient.id}
							firstName={patient.first_name} // Zgodnie z przykładem API
							lastName={patient.last_name} // Zgodnie z przykładem API
							dob={patient.dob}
							gender={patient.gender}
						/>
					))
				) : (
					<Typography variant='body1' color='text.secondary'>
						Nie znaleziono pacjentów.
					</Typography>
				)}
			</Box>
		</Box>
	)
}

export default PatientsView
