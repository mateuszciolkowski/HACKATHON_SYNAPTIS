import React, { useContext } from 'react'
import { Card, CardHeader, CardContent, Box, Typography, Divider, IconButton } from '@mui/material'
import { MoreVert } from '@mui/icons-material'
import AuthContext from '../../../context/AuthContext'

function UserInfoCard() {
	const { user } = useContext(AuthContext)

	return (
		<Card>
			<CardHeader
				title="Informacje o koncie"
				action={
					<IconButton>
						<MoreVert />
					</IconButton>
				}
			/>
			<CardContent>
				<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
					<Box>
						<Typography variant="body2" color="text.secondary">
							Email
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							{user?.email || 'Brak danych'}
						</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography variant="body2" color="text.secondary">
							Imię i nazwisko
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							{user?.first_name && user?.last_name
								? `${user.first_name} ${user.last_name}`
								: 'Brak danych'}
						</Typography>
					</Box>
					<Divider />
					<Box>
						<Typography variant="body2" color="text.secondary">
							ID użytkownika
						</Typography>
						<Typography variant="body1" sx={{ fontWeight: 500 }}>
							{user?.id || 'Brak danych'}
						</Typography>
					</Box>
				</Box>
			</CardContent>
		</Card>
	)
}

export default UserInfoCard

