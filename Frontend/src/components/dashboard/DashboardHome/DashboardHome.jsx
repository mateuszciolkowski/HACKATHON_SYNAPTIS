import React from 'react'
import { Box, Container, Typography, Grid } from '@mui/material'
import DashboardStats from '../DashboardStats/DashboardStats'
import UserInfoCard from '../UserInfoCard/UserInfoCard'
import QuickActionsCard from '../QuickActionsCard/QuickActionsCard'

function DashboardHome() {
	// Ten komponent nie potrzebuje 'useTheme', 'useState' ani 'handleDrawerToggle'
	// Otrzymuje je od swojego rodzica, 'Dashboard.jsx'

	return (
		// Zaczynamy od razu od treści.
		// Nie ma tu <Box sx={{ display: 'flex' ...>>, <DashboardHeader>, <DashboardSidebar>
		<>
			<Box sx={{ mb: 4 }}>
				<Typography variant='h4' component='h1' gutterBottom sx={{ fontWeight: 600 }}>
					Dashboard
				</Typography>
				<Typography variant='body1' color='text.secondary'>
					Przeglądaj statystyki i zarządzaj swoim kontem
				</Typography>
			</Box>

			<DashboardStats />

			<Grid container spacing={3}>
				<Grid item xs={12} md={8}>
					<UserInfoCard />
				</Grid>
				<Grid item xs={12} md={4}>
					<QuickActionsCard />
				</Grid>
			</Grid>
		</>
	)
}

export default DashboardHome
