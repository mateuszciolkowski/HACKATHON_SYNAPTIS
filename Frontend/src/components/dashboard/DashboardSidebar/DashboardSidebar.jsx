import React from 'react'
import { Box, Drawer, Toolbar, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material'
import { Dashboard as DashboardIcon, Settings as SettingsIcon, Assessment, People } from '@mui/icons-material'

const drawerWidth = 240

function DashboardSidebar({ mobileOpen, onMobileClose }) {
	const drawer = (
		<Box>
			<Toolbar
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					px: [2],
					py: [1],
				}}
			>
				<Typography variant="h6" noWrap component="div" sx={{ fontWeight: 600 }}>
					Dashboard
				</Typography>
			</Toolbar>
			<Divider />
			<List>
				<ListItem disablePadding>
					<ListItemButton selected>
						<ListItemIcon>
							<DashboardIcon />
						</ListItemIcon>
						<ListItemText primary="Dashboard" />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon>
							<Assessment />
						</ListItemIcon>
						<ListItemText primary="Raporty" />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon>
							<People />
						</ListItemIcon>
						<ListItemText primary="Użytkownicy" />
					</ListItemButton>
				</ListItem>
				<ListItem disablePadding>
					<ListItemButton>
						<ListItemIcon>
							<SettingsIcon />
						</ListItemIcon>
						<ListItemText primary="Ustawienia" />
					</ListItemButton>
				</ListItem>
			</List>
		</Box>
	)

	return (
		<Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="navigation">
			<Drawer
				variant="temporary"
				open={mobileOpen}
				onClose={onMobileClose}
				ModalProps={{
					keepMounted: true,
				}}
				sx={{
					display: { xs: 'block', md: 'none' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
			>
				{drawer}
			</Drawer>
			<Drawer
				variant="permanent"
				sx={{
					display: { xs: 'none', md: 'block' },
					'& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
				}}
				open
			>
				{drawer}
			</Drawer>
		</Box>
	)
}

export { drawerWidth }
export default DashboardSidebar

