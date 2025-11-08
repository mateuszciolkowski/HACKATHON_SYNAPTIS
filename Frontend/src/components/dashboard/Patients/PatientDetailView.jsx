// src/components/dashboard/Patients/PatientDetailView.jsx
import React, { useState, useEffect } from 'react'
import {
	Box,
	Typography,
	CircularProgress,
	Paper,
	IconButton,
	Divider,
	Grid, // Import Grid
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { axiosInstance } from '../../../context/AuthContext'
import BarChart from './BarChart' // Import nowego komponentu wykresu

// Dane, które podałeś, użyjemy ich do wykresu
const data = [10, 20, 30, 40, 50, 60, 70]

const PatientDetailView = ({ patientId, onBack }) => {
	const [patientData, setPatientData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	useEffect(() => {
		// Resetuj stan przy zmianie ID
		setLoading(true)
		setError(null)
		setPatientData(null)

		const fetchPatientData = async () => {
			try {
				// Użyj żądania GET /api/patients/{id}/full/
				const response = await axiosInstance.get(`/api/patients/${patientId}/full/`)
				setPatientData(response.data)
			} catch (err) {
				console.error('Failed to fetch patient details:', err)
				setError('Nie udało się pobrać szczegółowych danych pacjenta.')
			} finally {
				setLoading(false)
			}
		}

		if (patientId) {
			fetchPatientData()
		}
	}, [patientId]) // Efekt uruchamia się ponownie, gdy zmieni się patientId

	return (
		<Paper sx={{ p: 4, width: '100%' }}>
			{/* Przycisk powrotu i tytuł pozostają na górze */}
			<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
				<IconButton onClick={onBack} aria-label='Wróć do listy'>
					<ArrowBackIcon />
				</IconButton>
				<Typography variant='h5' component='h1' sx={{ ml: 1, fontWeight: 600 }}>
					Pełne Dane Pacjenta
				</Typography>
			</Box>

			{loading && <CircularProgress />}

			{error && <Typography color='error'>{error}</Typography>}

			{/* Używamy Grid do podziału na dwie kolumny */}
			{patientData && (
				<Grid container spacing={3}>
					{/* Lewa kolumna: Dane pacjenta */}
					<Grid item xs={12} md={7}>
						<Box>
							<Typography variant='h6'>Dane Osobowe</Typography>
							<Typography>
								<strong>Imię:</strong> {patientData.first_name}
							</Typography>
							<Typography>
								<strong>Nazwisko:</strong> {patientData.last_name}
							</Typography>
							<Typography>
								<strong>Data urodzenia:</strong> {patientData.dob}
							</Typography>
							<Typography>
								<strong>PESEL:</strong> {patientData.pesel}
							</Typography>
							<Typography>
								<strong>Płeć:</strong> {patientData.gender}
							</Typography>
							<Typography>
								<strong>Notatki:</strong> {patientData.notes || 'Brak'}
							</Typography>

							<Divider sx={{ my: 2 }} />

							<Typography variant='h6'>Historia Wizyt</Typography>
							{patientData.visits && patientData.visits.length > 0 ? (
								patientData.visits.map(visit => (
									<Box
										key={visit.id}
										sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: '4px' }}>
										<Typography>
											<strong>Data wizyty:</strong>{' '}
											{new Date(visit.visit_date).toLocaleString('pl-PL')}
										</Typography>
										<Typography>
											<strong>Notatki psychologa:</strong> {visit.psychologist_notes || 'Brak'}
										</Typography>
										<Typography>
											<strong>Podsumowanie AI:</strong> {visit.ai_summary || 'Brak'}
										</Typography>
										<Typography>
											<strong>Historia stresu:</strong> {visit.stress_history || 'Brak'}
										</Typography>
									</Box>
								))
							) : (
								<Typography>Brak zarejestrowanych wizyt.</Typography>
							)}
						</Box>
					</Grid>

					{/* Prawa kolumna: Wykres D3 */}
					<Grid item xs={12} md={5}>
						<Box>
							<Typography variant='h6'>Poziom Stresu (Wykres)</Typography>
							<Typography variant='body2' color='text.secondary' gutterBottom>
								Przykładowy wykres D3.js
							</Typography>
							{/* Tutaj renderujemy nasz komponent wykresu */}
							<BarChart data={data} />
						</Box>
					</Grid>
				</Grid>
			)}
		</Paper>
	)
}

export default PatientDetailView