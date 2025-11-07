import React, { useState } from 'react'
import { Box, Container, Typography, Button, Stack, Card, CardContent } from '@mui/material'
import Modal from '../../common/Modal'
import LoginForm from '../LoginForm'
import RegistrationForm from '../RegistrationForm'

function LoginPage() {
	const [modalOpen, setModalOpen] = useState(null)

	const closeModal = () => setModalOpen(null)

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
				position: 'relative',
				'&::before': {
					content: '""',
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
					pointerEvents: 'none',
				},
			}}
		>
			<Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
				<Card
					sx={{
						borderRadius: 4,
						boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
						overflow: 'hidden',
					}}
				>
					<CardContent sx={{ p: 5, textAlign: 'center' }}>
						<Typography
							variant="h3"
							component="h1"
							gutterBottom
							sx={{
								fontWeight: 700,
								mb: 1,
								background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
								backgroundClip: 'text',
								WebkitBackgroundClip: 'text',
								WebkitTextFillColor: 'transparent',
								fontSize: { xs: '2rem', sm: '2.5rem' },
							}}
						>
							Witaj!
						</Typography>
						<Typography
							variant="body1"
							color="text.secondary"
							sx={{
								mb: 4,
								fontSize: '1.0625rem',
								lineHeight: 1.6,
							}}
						>
							Zaloguj się lub zarejestruj, aby kontynuować
						</Typography>
						<Stack
							direction={{ xs: 'column', sm: 'row' }}
							spacing={2}
							justifyContent="center"
						>
							<Button
								variant="contained"
								size="large"
								onClick={() => setModalOpen('login')}
								sx={{
									px: 4,
									py: 1.5,
									borderRadius: 2,
									textTransform: 'none',
									fontSize: '1rem',
									fontWeight: 600,
									boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
									'&:hover': {
										boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
									},
								}}
							>
								Zaloguj się
							</Button>
							<Button
								variant="outlined"
								size="large"
								onClick={() => setModalOpen('register')}
								sx={{
									px: 4,
									py: 1.5,
									borderRadius: 2,
									textTransform: 'none',
									fontSize: '1rem',
									fontWeight: 600,
									borderWidth: 2,
									'&:hover': {
										borderWidth: 2,
										backgroundColor: 'rgba(102, 126, 234, 0.04)',
									},
								}}
							>
								Zarejestruj się
							</Button>
						</Stack>
					</CardContent>
				</Card>
			</Container>

			<Modal isOpen={modalOpen === 'login'} onClose={closeModal} title="Zaloguj się">
				<LoginForm
					onSuccess={closeModal}
					onSwitchToRegister={() => setModalOpen('register')}
				/>
			</Modal>

			<Modal isOpen={modalOpen === 'register'} onClose={closeModal} title="Utwórz konto">
				<RegistrationForm
					onSuccess={() => setModalOpen('login')}
					onSwitchToLogin={() => setModalOpen('login')}
				/>
			</Modal>
		</Box>
	)
}

export default LoginPage

