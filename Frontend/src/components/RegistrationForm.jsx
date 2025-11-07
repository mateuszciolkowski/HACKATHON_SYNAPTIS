// src/components/RegistrationForm.js
import React, { useState } from 'react'
import './Form.css' // Wspólne style dla formularzy

function RegistrationForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		if (password !== confirmPassword) {
			alert('Hasła się nie zgadzają!')
			return
		}
		// Tutaj wysyłka do API
		alert(`Rejestracja użytkownika: ${email}`)
		console.log({ email, password })
	}

	return (
		<form onSubmit={handleSubmit} className='form-container'>
			<div className='form-group'>
				<label htmlFor='reg-email'>Email</label>
				<input id='reg-email' type='email' value={email} onChange={e => setEmail(e.target.value)} required />
			</div>
			<div className='form-group'>
				<label htmlFor='reg-password'>Hasło</label>
				<input
					id='reg-password'
					type='password'
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
				/>
			</div>
			<div className='form-group'>
				<label htmlFor='reg-confirm-password'>Potwierdź hasło</label>
				<input
					id='reg-confirm-password'
					type='password'
					value={confirmPassword}
					onChange={e => setConfirmPassword(e.target.value)}
					required
				/>
			</div>
			<button type='submit' className='form-button'>
				Zarejestruj
			</button>
		</form>
	)
}

export default RegistrationForm
