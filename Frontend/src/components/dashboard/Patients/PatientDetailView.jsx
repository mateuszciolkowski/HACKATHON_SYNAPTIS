// src/components/dashboard/Patients/PatientDetailView.jsx
import React, { useState, useEffect } from 'react'
import {
	Box,
	Typography,
	CircularProgress,
	Paper,
	IconButton,
	Divider,
	Grid,
	Select, // --- Import Select ---
	MenuItem, // --- Import MenuItem ---
	FormControl, // --- Import FormControl ---
	InputLabel, // --- Import InputLabel ---
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { axiosInstance } from '../../../context/AuthContext'
import BarChart from './BarChart'

const PatientDetailView = ({ patientId, onBack }) => {
	const [patientData, setPatientData] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	// --- NOWY STAN ---
	// Przechowuje ID aktualnie *wybranej* wizyty z listy. '' oznacza 'żadna'.
	const [selectedVisitId, setSelectedVisitId] = useState('')
	// ---------------

	useEffect(() => {
		setLoading(true)
		setError(null)
		setPatientData(null)
		setSelectedVisitId('') // Resetuj wybór wizyty przy zmianie pacjenta

		const fetchPatientData = async () => {
			try {
				const response = await axiosInstance.get(`/api/patients/${patientId}/full/`)
				setPatientData(response.data)

				// Opcjonalnie: automatycznie wybierz pierwszą wizytę, jeśli istnieje
				// if (response.data?.visits?.length > 0) {
				// 	setSelectedVisitId(response.data.visits[0].id)
				// }

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
	}, [patientId])

	// --- NOWA FUNKCJA ---
	// Obsługuje zmianę w liście rozwijanej
	const handleVisitChange = event => {
		setSelectedVisitId(event.target.value)
	}
	// --------------------
	
	// --- ZNAJDŹ WYBRANĄ WIZYTĘ ---
	// Znajdź pełny obiekt wybranej wizyty na podstawie jej ID
	const selectedVisit =
		patientData?.visits.find(visit => visit.id === selectedVisitId) || null
	// ---------------------------

	return (
		// --- ZMIANA: Dodano minHeight, aby rozciągnąć widok ---
		<Paper sx={{ p: 4, width: '100%', minHeight: '85vh' }}>
			{/* Nagłówek z przyciskiem powrotu */}
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

			{patientData && (
				<Grid container spacing={3}>
					{/* Lewa kolumna: Dane osobowe (bez zmian) */}
					<Grid item xs={12} md={5}>
						<Box>
							<Typography variant='h6' gutterBottom>
								Dane Osobowe
							</Typography>
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
						</Box>
					</Grid>

					{/* Prawa kolumna: Historia wizyt (PRZEBUDOWANA) */}
					<Grid item xs={12} md={7}>
						<Typography variant='h6' gutterBottom>
							Historia Wizyt
						</Typography>
						
						{patientData.visits && patientData.visits.length > 0 ? (
							<Box>
								{/* --- NOWA LISTA ROZWIJANA (SELECT) --- */}
								<FormControl fullWidth sx={{ mb: 3 }}>
									<InputLabel id='visit-select-label'>Wybierz datę wizyty</InputLabel>
									<Select
										labelId='visit-select-label'
										id='visit-select'
										value={selectedVisitId}
										label='Wybierz datę wizyty'
										onChange={handleVisitChange}
									>
										{/* Pusta opcja "Wybierz" */}
										<MenuItem value=''>
											<em>Wybierz...</em>
										</MenuItem>
										
										{/* Mapowanie wizyt do opcji w liście */}
										{patientData.visits.map(visit => (
											<MenuItem key={visit.id} value={visit.id}>
												{new Date(visit.visit_date).toLocaleString('pl-PL')}
											</MenuItem>
										))}
									</Select>
								</FormControl>

								{/* --- KONTENER NA SZCZEGÓŁY WYBRANEJ WIZYTY --- */}
								{/* Wyświetlany tylko jeśli jakaś wizyta jest wybrana */}
								{selectedVisit && (
									<Paper variant='outlined' sx={{ p: 2 }}>
										<Typography>
											<strong>Notatki psychologa:</strong>{' '}
											{selectedVisit.psychologist_notes || 'Brak'}
										</Typography>
										<Typography sx={{ mt: 1 }}>
											<strong>Podsumowanie AI:</strong> {selectedVisit.ai_summary || 'Brak'}
										</Typography>

										<Divider sx={{ my: 2 }} />

										<Box>
											<Typography variant='subtitle1' fontWeight={600}>
												Historia stresu dla wybranej wizyty:
											</Typography>
											{selectedVisit.stress_history &&
											selectedVisit.stress_history.length > 0 ? (
												<BarChart data={selectedVisit.stress_history} />
											) : (
												<Typography>Brak historii stresu dla tej wizyty.</Typography>
											)}
										</Box>
									</Paper>
								)}
							</Box>
						) : (
							<Typography>Brak zarejestrowanych wizyt.</Typography>
						)}
					</Grid>
				</Grid>
			)}
		</Paper>
	)
}

export default PatientDetailView