import React from 'react'
import { Grid } from '@mui/material'
import { TrendingUp, People, Assessment, Notifications as NotificationsIcon } from '@mui/icons-material'
import StatCard from './StatCard'

const stats = [
	{
		title: 'Całkowite przychody',
		value: '12,345 zł',
		change: '+12.5%',
		icon: <TrendingUp color="primary" />,
		color: 'primary',
	},
	{
		title: 'Nowi użytkownicy',
		value: '234',
		change: '+8.2%',
		icon: <People color="success" />,
		color: 'success',
	},
	{
		title: 'Aktywne sesje',
		value: '1,234',
		change: '+5.1%',
		icon: <Assessment color="info" />,
		color: 'info',
	},
	{
		title: 'Powiadomienia',
		value: '45',
		change: '-2.3%',
		icon: <NotificationsIcon color="warning" />,
		color: 'warning',
	},
]

function DashboardStats() {
	return (
		<Grid container spacing={3} sx={{ mb: 4 }}>
			{stats.map((stat, index) => (
				<Grid item xs={12} sm={6} md={3} key={index}>
					<StatCard {...stat} />
				</Grid>
			))}
		</Grid>
	)
}

export default DashboardStats

