import React, { useState } from 'react'
import { Box, Container, Typography, Grid, useTheme } from '@mui/material'
import DashboardHeader from '../DashboardHeader'
import DashboardSidebar, { drawerWidth } from '../DashboardSidebar'
import DashboardStats from '../DashboardStats'
import UserInfoCard from '../UserInfoCard'
import QuickActionsCard from '../QuickActionsCard'

function Dashboard() {
	const theme = useTheme()
	const [mobileOpen, setMobileOpen] = useState(false)

	const handleDrawerToggle = () => {
		setMobileOpen(!mobileOpen)
	}

	return (
		<Box sx={{ display: 'flex', minHeight: '100vh' }}>
			<DashboardHeader onMenuClick={handleDrawerToggle} />
			<DashboardSidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />

			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 3,
					width: { md: `calc(100% - ${drawerWidth}px)` },
					mt: 8,
					backgroundColor:
						theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
					minHeight: '100vh',
				}}
			>
				<Container maxWidth="xl">
					<Box sx={{ mb: 4 }}>
						<Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
							Dashboard
						</Typography>
						<Typography variant="body1" color="text.secondary">
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
				</Container>
			</Box>
		</Box>
	)
}

export default Dashboard

