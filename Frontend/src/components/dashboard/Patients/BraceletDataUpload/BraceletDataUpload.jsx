import React, { useState, useRef } from 'react'
import {
	Box,
	Button,
	Typography,
	Paper,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Chip,
	Alert,
} from '@mui/material'
import {
	CloudUpload as UploadIcon,
	Delete as DeleteIcon,
	Watch as WatchIcon,
	CheckCircle as CheckCircleIcon,
} from '@mui/icons-material'

function BraceletDataUpload({ visitId, onUpload }) {
	const [dataFile, setDataFile] = useState(null)
	const [parsedData, setParsedData] = useState(null)
	const [error, setError] = useState(null)
	const fileInputRef = useRef(null)

	const handleFileSelect = async (event) => {
		const file = event.target.files[0]
		if (!file) return

		setError(null)

		try {
			// Sprawdź typ pliku
			const isJson = file.name.endsWith('.json')
			const isPkl = file.name.endsWith('.pkl')

			if (!isJson && !isPkl) {
				setError('Nieobsługiwany format pliku. Obsługiwane formaty: .json, .pkl')
				return
			}

			let parsedData = null

			if (isJson) {
				// Parsuj plik JSON
				const text = await file.text()
				const jsonData = JSON.parse(text)

				// Wyciągnij dane z struktury JSON
				const signal = jsonData.signal?.wrist || jsonData.signal || {}
				const metadata = jsonData.metadata || {}
				const duration = metadata.duration_seconds || 300

				// Oblicz liczbę próbek na podstawie rzeczywistych danych lub metadanych
				const accData = signal.ACC || []
				const bvpData = signal.BVP || []
				const edaData = signal.EDA || []
				const tempData = signal.TEMP || []

				// Jeśli dane są pełne, użyj rzeczywistej liczby próbek
				// W przeciwnym razie użyj częstotliwości próbkowania z metadanych
				const accRate = metadata.sampling_rates?.ACC || 32
				const bvpRate = metadata.sampling_rates?.BVP || 64
				const edaRate = metadata.sampling_rates?.EDA || 4
				const tempRate = metadata.sampling_rates?.TEMP || 4

				const accSamples = accData.length > 0 ? accData.length : accRate * duration
				const bvpSamples = bvpData.length > 0 ? bvpData.length : bvpRate * duration
				const edaSamples = edaData.length > 0 ? edaData.length : edaRate * duration
				const tempSamples = tempData.length > 0 ? tempData.length : tempRate * duration

				parsedData = {
					acc: {
						samples: accSamples,
						rate: accRate,
						shape: [accSamples, Array.isArray(accData[0]) ? accData[0].length : 3],
						description: 'Akcelerometr (3 osie: x, y, z)',
						data: accData.length > 0 ? accData : null,
					},
					bvp: {
						samples: bvpSamples,
						rate: bvpRate,
						shape: [bvpSamples, 1],
						description: 'Blood Volume Pulse',
						data: bvpData.length > 0 ? bvpData : null,
					},
					eda: {
						samples: edaSamples,
						rate: edaRate,
						shape: [edaSamples, 1],
						description: 'Electrodermal Activity',
						data: edaData.length > 0 ? edaData : null,
					},
					temp: {
						samples: tempSamples,
						rate: tempRate,
						shape: [tempSamples, 1],
						description: 'Temperatura',
						data: tempData.length > 0 ? tempData : null,
					},
					duration: duration,
					fileSize: file.size,
					fileName: file.name,
					metadata: metadata,
					note: jsonData.note || null,
				}
			} else if (isPkl) {
				// Dla plików .pkl na razie używamy mock danych
				// W przyszłości tutaj będzie prawdziwe parsowanie pliku .pkl
				await new Promise(resolve => setTimeout(resolve, 500))

				parsedData = {
					acc: {
						samples: 9600, // 32 Hz * 300 sekund
						rate: 32,
						shape: [9600, 3],
						description: 'Akcelerometr (3 osie: x, y, z)'
					},
					bvp: {
						samples: 19200, // 64 Hz * 300 sekund
						rate: 64,
						shape: [19200, 1],
						description: 'Blood Volume Pulse'
					},
					eda: {
						samples: 1200, // 4 Hz * 300 sekund
						rate: 4,
						shape: [1200, 1],
						description: 'Electrodermal Activity'
					},
					temp: {
						samples: 1200, // 4 Hz * 300 sekund
						rate: 4,
						shape: [1200, 1],
						description: 'Temperatura'
					},
					duration: 300, // sekundy
					fileSize: file.size,
					fileName: file.name,
				}
			}

			setDataFile(file)
			setParsedData(parsedData)

			// Mock upload - w przyszłości tutaj będzie prawdziwy upload
			if (onUpload) {
				onUpload(parsedData, visitId)
			}
		} catch (err) {
			setError('Błąd podczas parsowania pliku. Upewnij się, że plik ma poprawny format.')
			console.error('Error parsing file:', err)
		}
	}

	const handleDelete = () => {
		setDataFile(null)
		setParsedData(null)
		setError(null)
		if (fileInputRef.current) {
			fileInputRef.current.value = ''
		}
	}

	const handleUploadClick = () => {
		fileInputRef.current?.click()
	}

	return (
		<Box>
			{parsedData ? (
				<Box>
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
						<Typography variant='body2' color='text.secondary' sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
							<WatchIcon sx={{ fontSize: '1.2rem' }} />
							<CheckCircleIcon sx={{ fontSize: '1.2rem', color: 'success.main' }} />
							Dane wgrane: {dataFile?.name}
						</Typography>
						<IconButton
							onClick={handleDelete}
							size="small"
							sx={{
								color: 'error.main',
								'&:hover': {
									backgroundColor: 'rgba(211, 47, 47, 0.08)',
								},
							}}>
							<DeleteIcon />
						</IconButton>
					</Box>

					{parsedData.note && (
						<Alert severity="info" sx={{ mb: 2, borderRadius: 2 }}>
							{parsedData.note}
						</Alert>
					)}
					{parsedData.metadata && (
						<Box sx={{ mb: 2, p: 1.5, backgroundColor: 'rgba(74, 144, 226, 0.05)', borderRadius: 1 }}>
							<Typography variant='caption' color='text.secondary' sx={{ display: 'block', mb: 0.5 }}>
								<strong>Urządzenie:</strong> {parsedData.metadata.device || 'Nieznane'}
							</Typography>
							{parsedData.metadata.recording_date && (
								<Typography variant='caption' color='text.secondary' sx={{ display: 'block' }}>
									<strong>Data nagrania:</strong> {new Date(parsedData.metadata.recording_date).toLocaleString('pl-PL')}
								</Typography>
							)}
						</Box>
					)}
					<Paper
						variant='outlined'
						sx={{
							p: 2.5,
							borderRadius: 2,
							borderColor: 'rgba(74, 144, 226, 0.3)',
							backgroundColor: 'rgba(74, 144, 226, 0.02)',
						}}>
						<Typography variant='subtitle2' sx={{ mb: 2, fontWeight: 600, color: '#4A90E2' }}>
							Podsumowanie danych z bransoletki
						</Typography>

						<TableContainer>
							<Table size="small">
								<TableHead>
									<TableRow>
										<TableCell sx={{ fontWeight: 600 }}>Sygnał</TableCell>
										<TableCell sx={{ fontWeight: 600 }} align="right">Częstotliwość</TableCell>
										<TableCell sx={{ fontWeight: 600 }} align="right">Próbki</TableCell>
										<TableCell sx={{ fontWeight: 600 }} align="right">Kształt</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell>
											<Box>
												<Typography variant='body2' sx={{ fontWeight: 600 }}>ACC</Typography>
												<Typography variant='caption' color='text.secondary'>
													{parsedData.acc.description}
												</Typography>
											</Box>
										</TableCell>
										<TableCell align="right">{parsedData.acc.rate} Hz</TableCell>
										<TableCell align="right">{parsedData.acc.samples.toLocaleString()}</TableCell>
										<TableCell align="right">
											<Chip label={parsedData.acc.shape.join(' × ')} size="small" />
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Box>
												<Typography variant='body2' sx={{ fontWeight: 600 }}>BVP</Typography>
												<Typography variant='caption' color='text.secondary'>
													{parsedData.bvp.description}
												</Typography>
											</Box>
										</TableCell>
										<TableCell align="right">{parsedData.bvp.rate} Hz</TableCell>
										<TableCell align="right">{parsedData.bvp.samples.toLocaleString()}</TableCell>
										<TableCell align="right">
											<Chip label={parsedData.bvp.shape.join(' × ')} size="small" />
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Box>
												<Typography variant='body2' sx={{ fontWeight: 600 }}>EDA</Typography>
												<Typography variant='caption' color='text.secondary'>
													{parsedData.eda.description}
												</Typography>
											</Box>
										</TableCell>
										<TableCell align="right">{parsedData.eda.rate} Hz</TableCell>
										<TableCell align="right">{parsedData.eda.samples.toLocaleString()}</TableCell>
										<TableCell align="right">
											<Chip label={parsedData.eda.shape.join(' × ')} size="small" />
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>
											<Box>
												<Typography variant='body2' sx={{ fontWeight: 600 }}>TEMP</Typography>
												<Typography variant='caption' color='text.secondary'>
													{parsedData.temp.description}
												</Typography>
											</Box>
										</TableCell>
										<TableCell align="right">{parsedData.temp.rate} Hz</TableCell>
										<TableCell align="right">{parsedData.temp.samples.toLocaleString()}</TableCell>
										<TableCell align="right">
											<Chip label={parsedData.temp.shape.join(' × ')} size="small" />
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>

						<Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(74, 144, 226, 0.2)' }}>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
								<Typography variant='body2' color='text.secondary'>
									Czas trwania sesji
								</Typography>
								<Chip 
									label={`${Math.floor(parsedData.duration / 60)}:${(parsedData.duration % 60).toString().padStart(2, '0')}`}
									color="primary"
									sx={{ fontWeight: 600 }}
								/>
							</Box>
							<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
								<Typography variant='body2' color='text.secondary'>
									Rozmiar pliku
								</Typography>
								<Typography variant='body2' sx={{ fontWeight: 600 }}>
									{(parsedData.fileSize / 1024).toFixed(2)} KB
								</Typography>
							</Box>
						</Box>
					</Paper>
				</Box>
			) : (
				<Box>
					<Paper
						variant='outlined'
						sx={{
							p: 3,
							borderRadius: 2,
							borderColor: 'rgba(74, 144, 226, 0.3)',
							borderStyle: 'dashed',
							textAlign: 'center',
							backgroundColor: 'rgba(74, 144, 226, 0.02)',
							cursor: 'pointer',
							transition: 'all 0.2s ease',
							'&:hover': {
								backgroundColor: 'rgba(74, 144, 226, 0.05)',
								borderColor: '#4A90E2',
							},
						}}
						onClick={handleUploadClick}>
						<input
							ref={fileInputRef}
							type="file"
							accept=".pkl,.json"
							onChange={handleFileSelect}
							style={{ display: 'none' }}
						/>
						<WatchIcon sx={{ fontSize: 48, color: '#4A90E2', mb: 2 }} />
						<Typography variant='body1' sx={{ mb: 1, fontWeight: 600, color: '#4A90E2' }}>
							Kliknij, aby wgrać dane z bransoletki
						</Typography>
						<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
							Obsługiwane formaty: .pkl (pickle), .json
						</Typography>
						<Button
							variant='contained'
							startIcon={<UploadIcon />}
							sx={{
								borderRadius: 2,
								textTransform: 'none',
								fontSize: '0.9375rem',
								fontWeight: 600,
								px: 3,
								py: 1,
								backgroundColor: '#4A90E2',
								boxShadow: '0 4px 12px rgba(74, 144, 226, 0.4)',
								'&:hover': {
									backgroundColor: '#3A7BC8',
									boxShadow: '0 6px 16px rgba(74, 144, 226, 0.5)',
								},
							}}>
							Wybierz plik
						</Button>
					</Paper>
					{error && (
						<Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
							{error}
						</Alert>
					)}
				</Box>
			)}
		</Box>
	)
}

export default BraceletDataUpload

