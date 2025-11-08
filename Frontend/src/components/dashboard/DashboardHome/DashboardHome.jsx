import React from 'react'
import { Box, Typography, Grid } from '@mui/material'
import DashboardStats from '../DashboardStats/DashboardStats'
import UserInfoCard from '../UserInfoCard/UserInfoCard'
import QuickActionsCard from '../QuickActionsCard/QuickActionsCard'
import StressTrendChart from '../StressTrendChart'
import StressClassDistribution from '../StressClassDistribution'
import StressAlerts from '../StressAlerts'

function DashboardHome() {
	return (
		<>
			<Box sx={{ mb: 4 }}>
				<Typography variant='h4' component='h1' gutterBottom sx={{ fontWeight: 600 }}>
					Dashboard
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					Przeglądaj statystyki i zarządzaj swoim kontem
				</Typography>
			</Box>

			{/* Statystyki */}
			<DashboardStats />

			{/* Wykresy */}
			<Grid container spacing={3} sx={{ mb: 3 }}>
				<Grid item xs={12} md={8}>
					<StressTrendChart />
				</Grid>
				<Grid item xs={12} md={4}>
					<StressClassDistribution />
				</Grid>
			</Grid>

			{/* Alerty i informacje */}
			<Grid container spacing={3} sx={{ mb: 3 }}>
				<Grid item xs={12} md={8}>
					<StressAlerts />
				</Grid>
				<Grid item xs={12} md={4}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<UserInfoCard />
						</Grid>
						<Grid item xs={12}>
							<QuickActionsCard />
						</Grid>
					</Grid>
				</Grid>
			</Grid>
		</>
	)
}

export default DashboardHome
