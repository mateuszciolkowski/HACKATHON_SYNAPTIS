// src/components/dashboard/UsersPage.jsx
import React from 'react'
import { Typography, Box } from '@mui/material'

function Calendar() {
	return (
		<Box>
			<Typography variant='h4' component='h1' gutterBottom sx={{ fontWeight: 600 }}>
				Kalendarz
			</Typography>
			<Typography variant='body1' color='text.secondary'>
				Tutaj będziesz zarządzać wizytami.
			</Typography>
		</Box>
	)
}

export default Calendar
