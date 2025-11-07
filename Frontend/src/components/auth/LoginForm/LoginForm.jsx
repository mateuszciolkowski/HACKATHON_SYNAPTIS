import React, { useState, useContext } from 'react'
import AuthContext from '../../../context/AuthContext'
import '../../styles/Form.css'

function LoginForm({ onSuccess }) {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)

	const { loginUser } = useContext(AuthContext)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError(null)

		try {
			await loginUser(email, password)
			onSuccess()
		} catch (err) {
			console.error('Login error:', err)
			setError(err.message || 'Nieprawidłowy email lub hasło.')
		}
	}

	return (
		<form onSubmit={handleSubmit} className="form-container">
			{error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

			<div className="form-group">
				<label htmlFor="login-email">Email</label>
				<input
					id="login-email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>
			<div className="form-group">
				<label htmlFor="login-password">Hasło</label>
				<input
					id="login-password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			<button type="submit" className="form-button">
				Zaloguj
			</button>
		</form>
	)
}

export default LoginForm

