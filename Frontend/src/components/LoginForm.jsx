// src/components/LoginForm.js
import React, { useState } from 'react'
import './Form.css' // Wspólne style dla formularzy

const LoginForm = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const handleSubmit = e => {
		e.preventDefault()
		// Tutaj normalnie wysyłałbyś dane do API
		alert(`Logowanie użytkownika: ${email}`)
		console.log({ email, password })
	}

	return (
		<form onSubmit={handleSubmit} className='form-container'>
			<div className='form-group'>
				<label htmlFor='login-email'>Email</label>
				<input id='login-email' type='email' value={email} onChange={e => setEmail(e.target.value)} required />
			</div>
			<div className='form-group'>
				<label htmlFor='login-password'>Hasło</label>
				<input
					id='login-password'
					type='password'
					value={password}
					onChange={e => setPassword(e.target.value)}
					required
				/>
			</div>
			<button type='submit' className='form-button'>
				Zaloguj
			</button>
		</form>
	)
}

export default LoginForm
