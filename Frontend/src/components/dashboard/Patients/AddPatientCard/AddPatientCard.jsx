import React from 'react'
import { Paper, Box, Typography, Avatar } from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

function AddPatientCard({ onClick }) {
	return (
		<Paper
			onClick={onClick}
			elevation={3}
			sx={{
				p: 2.5,
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				justifyContent: 'center',
				cursor: 'pointer',
				transition: 'box-shadow 0.3s ease, transform 0.2s ease, background-color 0.2s ease',
				'&:hover': {
					transform: 'translateY(-4px)',
					boxShadow: 8,
					bgcolor: 'primary.lighter',
				},
				borderRadius: 2,
				width: '100%',
				minHeight: '140px',
				border: '2px dashed',
				borderColor: 'primary.main',
			}}>
			<Avatar
				sx={{
					width: 60,
					height: 60,
					mb: 1,
					bgcolor: 'primary.light',
				}}>
				<AddIcon sx={{ fontSize: '2.5rem', color: 'primary.dark' }} />
			</Avatar>
			<Typography variant='h6' component='div' fontWeight={600} color='primary.main'>
				Dodaj pacjenta
			</Typography>
		</Paper>
	)
}

export default AddPatientCard

