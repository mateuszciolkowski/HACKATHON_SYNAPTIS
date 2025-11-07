import React, { useState } from 'react'
import { Box, useTheme } from '@mui/material'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import DashboardSidebar, { drawerWidth } from '../components/dashboard/DashboardSidebar'

function MainLayout({ children }) {
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
					p: 4,
					width: { md: `calc(100% - ${drawerWidth}px)` },
					mt: 8,
					backgroundColor: '#1a1a2e',
					backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(124, 185, 232, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 213, 226, 0.1) 0%, transparent 50%)',
					minHeight: '100vh',
					transition: 'all 0.3s ease-in-out',
				}}
			>
				{children}
			</Box>
		</Box>
	)
}

export default MainLayout

