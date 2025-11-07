import React, { useContext } from 'react'
import Dashboard from './dashboard/Dashboard/Dashboard'
import LoginPage from './auth/LoginPage'
import AuthContext from '../context/AuthContext'

function HomePage() {
	const { user } = useContext(AuthContext)

	// Jeśli użytkownik jest zalogowany, pokaż dashboard
	if (user) {
		return <Dashboard />
	}

	// Jeśli użytkownik nie jest zalogowany, pokaż stronę logowania
	return <LoginPage />
}

export default HomePage
