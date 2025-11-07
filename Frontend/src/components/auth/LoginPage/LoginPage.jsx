import React, { useState } from 'react'
import { Box, Container, Typography, Button, Stack } from '@mui/material'
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
			}}
		>
			<Container maxWidth="sm">
				<Box
					sx={{
						backgroundColor: 'white',
						padding: 4,
						borderRadius: 2,
						boxShadow: 3,
						textAlign: 'center',
					}}
				>
					<Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
						Witaj!
					</Typography>
					<Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
						Zaloguj się lub zarejestruj, aby kontynuować
					</Typography>
					<Stack direction="row" spacing={2} justifyContent="center">
						<Button
							variant="contained"
							size="large"
							onClick={() => setModalOpen('login')}
							sx={{ px: 4 }}
						>
							Zaloguj się
						</Button>
						<Button
							variant="outlined"
							size="large"
							onClick={() => setModalOpen('register')}
							sx={{ px: 4 }}
						>
							Zarejestruj się
						</Button>
					</Stack>
				</Box>
			</Container>

			<Modal isOpen={modalOpen === 'login'} onClose={closeModal} title="Zaloguj się">
				<LoginForm onSuccess={closeModal} />
			</Modal>

			<Modal isOpen={modalOpen === 'register'} onClose={closeModal} title="Utwórz konto">
				<RegistrationForm onSuccess={() => setModalOpen('login')} />
			</Modal>
		</Box>
	)
}

export default LoginPage

