import React from 'react'
import { Card, CardHeader, CardContent, Box, Button } from '@mui/material'
import { Settings as SettingsIcon, Assessment, People } from '@mui/icons-material'

function QuickActionsCard() {
	return (
		<Card>
			<CardHeader title="Szybkie akcje" />
			<CardContent>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Button variant="contained" fullWidth startIcon={<SettingsIcon />}>
						Ustawienia konta
					</Button>
					<Button variant="outlined" fullWidth startIcon={<Assessment />}>
						Zobacz raporty
					</Button>
					<Button variant="outlined" fullWidth startIcon={<People />}>
						Zarządzaj użytkownikami
					</Button>
				</Box>
			</CardContent>
		</Card>
	)
}

export default QuickActionsCard

