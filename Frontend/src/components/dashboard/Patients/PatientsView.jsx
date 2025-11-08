// src/components/dashboard/Patients/Patients.jsx
import React, { useState, useEffect } from 'react'
import { Typography, Box, CircularProgress } from '@mui/material'
import Patient from './Patient/Patient'
import PatientDetailView from './PatientDetailView' // Import nowego widoku
import { axiosInstance } from '../../../context/AuthContext'

function PatientsView() {
	const [patients, setPatients] = useState([])
	const [listLoading, setListLoading] = useState(true)

	// Stan do zarządzania widokiem: null = lista, ID = widok szczegółowy
	const [selectedPatientId, setSelectedPatientId] = useState(null)

	// Pobieranie listy pacjentów (tylko raz)
	useEffect(() => {
		const fetchPatients = async () => {
			try {
				const response = await axiosInstance.get('/api/patients/')
				setPatients(response.data || [])
			} catch (error) {
				console.error('There was an error fetching the patients!', error)
			} finally {
				setListLoading(false)
			}
		}
		fetchPatients()
	}, [])

	// Funkcja do renderowania widoku listy
	const renderListView = () => (
		<Box>
			<Typography variant='h4' component='h1' gutterBottom sx={{ fontWeight: 600 }}>
				Lista Pacjentów
			</Typography>
			<Box>
				{listLoading ? (
					<CircularProgress />
				) : patients.length > 0 ? (
					patients.map(patient => (
						<Patient
							key={patient.id}
							firstName={patient.first_name}
							lastName={patient.last_name}
							dob={patient.dob}
							gender={patient.gender}
							// Ustawia wybrane ID, co spowoduje zmianę widoku
							onClick={() => setSelectedPatientId(patient.id)}
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

	// Funkcja do renderowania widoku szczegółów
	const renderDetailView = () => (
		<PatientDetailView
			patientId={selectedPatientId}
			// Przekazanie funkcji, która resetuje stan i wraca do listy
			onBack={() => setSelectedPatientId(null)}
		/>
	)

	// Główny render: warunkowo pokazuje listę lub szczegóły
	return <Box sx={{ width: '100%' }}>{selectedPatientId === null ? renderListView() : renderDetailView()}</Box>
}

export default PatientsView
