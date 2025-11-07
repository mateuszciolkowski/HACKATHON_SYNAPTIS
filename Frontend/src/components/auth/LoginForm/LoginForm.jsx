import React, { useState, useContext } from 'react'
import {
	Box,
	TextField,
	Button,
	Alert,
	InputAdornment,
	CircularProgress,
	Typography,
	Link,
} from '@mui/material'
import { Email as EmailIcon, Lock as LockIcon } from '@mui/icons-material'
import AuthContext from '../../../context/AuthContext'

function LoginForm({ onSuccess, onSwitchToRegister }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	const { loginUser } = useContext(AuthContext)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError(null)
		setLoading(true)

		try {
			await loginUser(email, password)
			onSuccess()
		} catch (err) {
			console.error('Login error:', err)
			setError(err.message || 'Nieprawidłowy email lub hasło.')
		} finally {
			setLoading(false)
		}
	}

	return (
		<Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 3 }}>
			{error && (
				<Alert severity="error" sx={{ borderRadius: 2, py: 0.5 }}>
					{error}
				</Alert>
			)}

			<TextField
				id="login-email"
				label="Email"
				type="email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
				fullWidth
				size="small"
				variant="outlined"
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<EmailIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: '1.2rem' }} />
						</InputAdornment>
					),
				}}
				sx={{
					'& .MuiOutlinedInput-root': {
						borderRadius: 2,
						'&:hover fieldset': {
							borderColor: 'primary.main',
						},
					},
				}}
			/>

			<TextField
				id="login-password"
				label="Hasło"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
				fullWidth
				size="small"
				variant="outlined"
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<LockIcon sx={{ color: 'rgba(0, 0, 0, 0.54)', fontSize: '1.2rem' }} />
						</InputAdornment>
					),
				}}
				sx={{
					'& .MuiOutlinedInput-root': {
						borderRadius: 2,
						'&:hover fieldset': {
							borderColor: 'primary.main',
						},
					},
				}}
			/>

			<Button
				type="submit"
				variant="contained"
				size="medium"
				fullWidth
				disabled={loading}
				sx={{
					mt: 0.5,
					py: 1,
					borderRadius: 2,
					textTransform: 'none',
					fontSize: '0.9375rem',
					fontWeight: 600,
					boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
					'&:hover': {
						boxShadow: '0 6px 16px rgba(102, 126, 234, 0.5)',
					},
				}}
			>
				{loading ? <CircularProgress size={20} color="inherit" /> : 'Zaloguj się'}
			</Button>

			{onSwitchToRegister && (
				<Box sx={{ mt: 1.5, textAlign: 'center' }}>
					<Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
						Nie masz konta?{' '}
						<Link
							component="button"
							type="button"
							onClick={onSwitchToRegister}
							sx={{
								color: 'primary.main',
								fontWeight: 600,
								textDecoration: 'none',
								cursor: 'pointer',
								fontSize: '0.875rem',
								'&:hover': {
									textDecoration: 'underline',
								},
							}}
						>
							Zarejestruj się
						</Link>
					</Typography>
				</Box>
			)}
		</Box>
	)
}

export default LoginForm

