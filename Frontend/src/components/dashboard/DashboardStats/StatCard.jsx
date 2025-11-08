import React from 'react'
import { Card, CardContent, Box, Typography, Chip } from '@mui/material'

function StatCard({ title, value, change, icon, color }) {
	return (
		<Card
			sx={{
				height: '100%',
				transition: 'transform 0.2s, box-shadow 0.2s',
				'&:hover': {
					transform: 'translateY(-4px)',
					boxShadow: 4,
				},
			}}
		>
			<CardContent>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
					<Box>
						<Typography color="text.secondary" variant="body2" gutterBottom>
							{title}
						</Typography>
						<Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
							{value}
						</Typography>
					</Box>
					<Box
						sx={{
							p: 1,
							borderRadius: 1,
							bgcolor: `${color}.light`,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						{icon}
					</Box>
				</Box>
				{change && (
					<Chip
						label={change}
						size="small"
						color={change.startsWith('+') ? 'success' : change.startsWith('-') ? 'error' : 'default'}
						sx={{ fontSize: '0.75rem' }}
					/>
				)}
			</CardContent>
		</Card>
	)
}

export default StatCard

