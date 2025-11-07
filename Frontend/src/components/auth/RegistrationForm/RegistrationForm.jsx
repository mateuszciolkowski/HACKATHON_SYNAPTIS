import React, { useState, useContext } from 'react'
import AuthContext from '../../../context/AuthContext'
import '../../styles/Form.css'

function RegistrationForm({ onSuccess }) {
	const [email, setEmail] = useState('')
	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [password, setPassword] = useState('')
	const [password2, setPassword2] = useState('')
	const [error, setError] = useState(null)

	const { registerUser } = useContext(AuthContext)

	const handleSubmit = async (e) => {
		e.preventDefault()
		setError(null)

		if (password !== password2) {
			setError('Hasła nie są identyczne!')
			return
		}

		try {
			await registerUser(email, password, password2, firstName, lastName)
			alert('Rejestracja pomyślna! Możesz się teraz zalogować.')
			onSuccess()
		} catch (err) {
			console.error('Registration error:', err)
			setError(err.message || 'Wystąpił błąd podczas rejestracji.')
		}
	}

	return (
		<form onSubmit={handleSubmit} className="form-container">
			{error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

			<div className="form-group">
				<label htmlFor="reg-email">Email</label>
				<input
					id="reg-email"
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</div>

			<div className="form-group">
				<label htmlFor="reg-firstname">Imię</label>
				<input
					id="reg-firstname"
					type="text"
					value={firstName}
					onChange={(e) => setFirstName(e.target.value)}
					required
				/>
			</div>
			<div className="form-group">
				<label htmlFor="reg-lastname">Nazwisko</label>
				<input
					id="reg-lastname"
					type="text"
					value={lastName}
					onChange={(e) => setLastName(e.target.value)}
					required
				/>
			</div>

			<div className="form-group">
				<label htmlFor="reg-password">Hasło</label>
				<input
					id="reg-password"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</div>
			<div className="form-group">
				<label htmlFor="reg-confirm-password">Potwierdź hasło</label>
				<input
					id="reg-confirm-password"
					type="password"
					value={password2}
					onChange={(e) => setPassword2(e.target.value)}
					required
				/>
			</div>
			<button type="submit" className="form-button">
				Zarejestruj
			</button>
		</form>
	)
}

export default RegistrationForm

