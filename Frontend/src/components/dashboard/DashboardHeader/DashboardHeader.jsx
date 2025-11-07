import React, { useState, useContext } from 'react'
import {
	AppBar,
	Toolbar,
	Typography,
	IconButton,
	Avatar,
	Menu,
	MenuItem,
	ListItemIcon,
	ListItemText,
	Box,
	Divider,
} from '@mui/material'
import { Menu as MenuIcon, Logout as LogoutIcon, AccountCircle, Settings as SettingsIcon, Notifications as NotificationsIcon } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import AuthContext from '../../../context/AuthContext'

const drawerWidth = 240

function DashboardHeader({ onMenuClick }) {
	const theme = useTheme()
	const { user, logoutUser } = useContext(AuthContext)
	const [anchorEl, setAnchorEl] = useState(null)

	const handleMenuOpen = (event) => {
		setAnchorEl(event.currentTarget)
	}

	const handleMenuClose = () => {
		setAnchorEl(null)
	}

	const handleLogout = () => {
		handleMenuClose()
		logoutUser()
	}

	return (
		<AppBar
			position="fixed"
			sx={{
				width: { md: `calc(100% - ${drawerWidth}px)` },
				ml: { md: `${drawerWidth}px` },
				zIndex: theme.zIndex.drawer + 1,
			}}
		>
			<Toolbar>
				<IconButton
					color="inherit"
					aria-label="open drawer"
					edge="start"
					onClick={onMenuClick}
					sx={{ mr: 2, display: { md: 'none' } }}
				>
					<MenuIcon />
				</IconButton>
				<Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
					Witaj, {user?.first_name || user?.email || 'Użytkowniku'}!
				</Typography>
				<Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
					<IconButton color="inherit">
						<NotificationsIcon />
					</IconButton>
					<IconButton onClick={handleMenuOpen} color="inherit">
						<Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
							{user?.first_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
						</Avatar>
					</IconButton>
					<Menu
						anchorEl={anchorEl}
						open={Boolean(anchorEl)}
						onClose={handleMenuClose}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
					>
						<MenuItem onClick={handleMenuClose}>
							<ListItemIcon>
								<AccountCircle fontSize="small" />
							</ListItemIcon>
							<ListItemText>Profil</ListItemText>
						</MenuItem>
						<MenuItem onClick={handleMenuClose}>
							<ListItemIcon>
								<SettingsIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText>Ustawienia</ListItemText>
						</MenuItem>
						<Divider />
						<MenuItem onClick={handleLogout}>
							<ListItemIcon>
								<LogoutIcon fontSize="small" />
							</ListItemIcon>
							<ListItemText>Wyloguj</ListItemText>
						</MenuItem>
					</Menu>
				</Box>
			</Toolbar>
		</AppBar>
	)
}

export default DashboardHeader

