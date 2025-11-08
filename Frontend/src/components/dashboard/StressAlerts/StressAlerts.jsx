import React, { useState, useEffect } from 'react'
import {
	Card,
	CardHeader,
	CardContent,
	Box,
	CircularProgress,
	Typography,
	Alert,
	AlertTitle,
	List,
	ListItem,
	ListItemText,
	Chip,
} from '@mui/material'
import { Warning as WarningIcon, AccessTime as AccessTimeIcon } from '@mui/icons-material'
import axios from 'axios'

// Configure axios instance
const axiosInstance = axios.create({
	baseURL: import.meta.env.DEV ? '' : '',
	headers: {
		'Content-Type': 'application/json',
	},
})

// Add request interceptor to include auth token
axiosInstance.interceptors.request.use(
	config => {
		const tokens = localStorage.getItem('authTokens')
		if (tokens) {
			try {
				const parsedTokens = JSON.parse(tokens)
				if (parsedTokens?.access) {
					config.headers.Authorization = `Bearer ${parsedTokens.access}`
				}
			} catch (error) {
				console.error('Error parsing tokens:', error)
			}
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

function StressAlerts() {
	const [highStressPatients, setHighStressPatients] = useState([])
	const [recentStressMoments, setRecentStressMoments] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchAlerts = async () => {
			try {
				setLoading(true)

				// Pobierz pacjentów
				const patientsResponse = await axiosInstance.get('/api/patients/')
				const patients = patientsResponse.data.results || patientsResponse.data || []
				const patientsMap = new Map(patients.map(p => [p.id, p]))

				// Pobierz wizyty
				const visitsResponse = await axiosInstance.get('/api/visits/')
				const visits = visitsResponse.data.results || visitsResponse.data || []

				// Znajdź pacjentów z wysokim poziomem stresu (>50%)
				const highStressList = []
				const stressMomentsList = []

				visits.forEach(visit => {
					if (visit.stress_history && visit.stress_history.summary) {
						const stressPercentage = visit.stress_history.summary.stress_percentage || 0
						
						if (stressPercentage > 50) {
							const patient = patientsMap.get(visit.patient)
							if (patient) {
								highStressList.push({
									patientId: visit.patient,
									patientName: `${patient.first_name} ${patient.last_name}`,
									stressLevel: stressPercentage,
									visitDate: visit.visit_date,
									visitId: visit.id,
								})
							}
						}

						// Pobierz ostatnie momenty stresu
						if (visit.stress_history.stress_moments && visit.stress_history.stress_moments.length > 0) {
							const patient = patientsMap.get(visit.patient)
							visit.stress_history.stress_moments.forEach(moment => {
								stressMomentsList.push({
									patientId: visit.patient,
									patientName: patient ? `${patient.first_name} ${patient.last_name}` : 'Nieznany',
									timestamp: moment.timestamp,
									duration: moment.duration_seconds,
									confidence: moment.confidence,
									visitId: visit.id,
								})
							})
						}
					}
				})

				// Sortuj: najnowsze pierwsze
				highStressList.sort((a, b) => new Date(b.visitDate) - new Date(a.visitDate))
				stressMomentsList.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

				setHighStressPatients(highStressList.slice(0, 5)) // Top 5
				setRecentStressMoments(stressMomentsList.slice(0, 5)) // Top 5
			} catch (error) {
				console.error('Error fetching alerts:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchAlerts()
	}, [])

	const formatDate = dateString => {
		const date = new Date(dateString)
		return date.toLocaleDateString('pl-PL', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		})
	}

	if (loading) {
		return (
			<Card>
				<CardHeader title="Alerty i powiadomienia" />
				<CardContent>
					<Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
						<CircularProgress />
					</Box>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardHeader title="Alerty i powiadomienia" />
			<CardContent>
				{/* Pacjenci z wysokim poziomem stresu */}
				<Box sx={{ mb: 3 }}>
					<Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<WarningIcon color="warning" />
						Pacjenci wymagający uwagi
					</Typography>
					{highStressPatients.length === 0 ? (
						<Alert severity="success">
							<AlertTitle>Brak alertów</AlertTitle>
							Wszyscy pacjenci mają poziom stresu w normie.
						</Alert>
					) : (
						<List>
							{highStressPatients.map((item, index) => (
								<ListItem
									key={index}
									sx={{
										border: '1px solid',
										borderColor: 'warning.light',
										borderRadius: 1,
										mb: 1,
										backgroundColor: 'warning.lighter',
									}}
								>
									<ListItemText
										primary={item.patientName}
										secondary={
											<Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
												<Typography variant="caption" color="text.secondary">
													{formatDate(item.visitDate)}
												</Typography>
												<Chip
													label={`${item.stressLevel.toFixed(1)}% stresu`}
													size="small"
													color="warning"
												/>
											</Box>
										}
									/>
								</ListItem>
							))}
						</List>
					)}
				</Box>

				{/* Ostatnie wykrycia stresu */}
				<Box>
					<Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
						<AccessTimeIcon color="info" />
						Ostatnie wykrycia stresu
					</Typography>
					{recentStressMoments.length === 0 ? (
						<Alert severity="info">
							<AlertTitle>Brak wykryć</AlertTitle>
							Nie znaleziono ostatnich momentów wykrytego stresu.
						</Alert>
					) : (
						<List>
							{recentStressMoments.map((moment, index) => (
								<ListItem
									key={index}
									sx={{
										border: '1px solid',
										borderColor: 'info.light',
										borderRadius: 1,
										mb: 1,
										backgroundColor: 'info.lighter',
									}}
								>
									<ListItemText
										primary={moment.patientName}
										secondary={
											<Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5, flexWrap: 'wrap' }}>
												<Typography variant="caption" color="text.secondary">
													{formatDate(moment.timestamp)}
												</Typography>
												<Chip
													label={`Czas trwania: ${moment.duration}s`}
													size="small"
													variant="outlined"
												/>
												<Chip
													label={`Pewność: ${(moment.confidence * 100).toFixed(0)}%`}
													size="small"
													variant="outlined"
													color="info"
												/>
											</Box>
										}
									/>
								</ListItem>
							))}
						</List>
					)}
				</Box>
			</CardContent>
		</Card>
	)
}

export default StressAlerts

