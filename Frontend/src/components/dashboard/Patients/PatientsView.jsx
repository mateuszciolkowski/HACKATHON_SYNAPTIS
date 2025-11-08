// src/components/dashboard/Patients/Patients.jsx
import React, { useState, useEffect } from 'react'
import {
	Typography,
	Box,
	CircularProgress,
	Grid, // Import komponentu Grid
} from '@mui/material'
import Patient from './Patient/Patient' // To jest teraz nasz nowy "kafelek"
import AddPatientCard from './AddPatientCard'
import PatientDetailView from './PatientDetailView'
import { axiosInstance } from '../../../context/AuthContext'

function PatientsView({ onViewChange }) {
	const [patients, setPatients] = useState([])
	const [listLoading, setListLoading] = useState(true)
	const [selectedPatientId, setSelectedPatientId] = useState(null)

	const fetchPatients = async () => {
		try {
			setListLoading(true)
			const response = await axiosInstance.get('/api/patients/')
			setPatients(response.data.results || response.data || [])
		} catch (error) {
			console.error('There was an error fetching the patients!', error)
		} finally {
			setListLoading(false)
		}
	}

	useEffect(() => {
		fetchPatients()
	}, [])

	// ZMODYFIKOWANA funkcja renderowania listy
	const renderListView = () => (
		<Box>
			<Typography variant='h4' component='h1' gutterBottom sx={{ fontWeight: 600 }}>
				Lista Pacjentów
			</Typography>

			{listLoading ? (
				<CircularProgress />
			) : (
				// --- ZMIANA: Używamy Grid container ---
				// 'spacing={3}' dodaje odstępy między kafelkami
				<Grid container spacing={3}>
					{/* Kafelek dodawania pacjenta - zawsze pierwszy */}
					{onViewChange && (
						<Grid item xs={12} sm={8} md={6} lg={4}>
							<AddPatientCard onClick={() => onViewChange('add-patient')} />
						</Grid>
					)}
					{/* Lista pacjentów */}
					{patients.map(patient => (
						// Każdy kafelek jest elementem siatki
						// Ustawiamy responsywność:
						// lg={3} = 4 kolumny na dużych ekranach
						// md={4} = 3 kolumny na średnich
						// sm={6} = 2 kolumny na małych
						// xs={12} = 1 kolumna na mobilnych
						<Grid item key={patient.id} xs={12} sm={8} md={6} lg={4}>
							<Patient
								firstName={patient.first_name}
								lastName={patient.last_name}
								dob={patient.dob}
								gender={patient.gender}
								onClick={() => setSelectedPatientId(patient.id)}
							/>
						</Grid>
					))}
				</Grid>
			)}
		</Box>
	)

	// Widok szczegółowy (bez zmian)
	const renderDetailView = () => (
		<PatientDetailView patientId={selectedPatientId} onBack={() => setSelectedPatientId(null)} />
	)

	// Logika przełączania widoków (bez zmian)
	return <Box sx={{ width: '100%' }}>{selectedPatientId === null ? renderListView() : renderDetailView()}</Box>
}

export default PatientsView
