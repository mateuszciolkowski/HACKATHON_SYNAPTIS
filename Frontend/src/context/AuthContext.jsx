import React, { createContext, useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const API_URLS = {
	login: '/auth/login/',
	register: '/auth/register/',
	refresh: '/auth/token/refresh/',
}

const AuthContext = createContext()
export default AuthContext

export const AuthProvider = ({ children }) => {
	// 2. Wczytaj tokeny z localStorage przy starcie aplikacji
	const [authTokens, setAuthTokens] = useState(() =>
		localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
	)

	// 3. Wczytaj użytkownika (zdekodowanego z tokena)
	const [user, setUser] = useState(() =>
		localStorage.getItem('authTokens') ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access) : null
	)

	const [loading, setLoading] = useState(true) // Do obsługi początkowego ładowania

	/**
	 * Funkcja logowania
	 */
	const loginUser = async (email, password) => {
		const response = await axios.post(API_URLS.login, {
			email,
			password,
		})

		if (response.status === 200) {
			const data = response.data
			setAuthTokens(data)
			setUser(jwtDecode(data.access))
			localStorage.setItem('authTokens', JSON.stringify(data))
		}
		// Błąd (np. 401) zostanie automatycznie rzucony przez axios i złapany w formularzu
	}

	/**
	 * Funkcja rejestracji
	 */
	const registerUser = async (email, password, password2, first_name, last_name) => {
		await axios.post(API_URLS.register, {
			email,
			password,
			password2,
			first_name,
			last_name,
		})
		// Zakładamy, że API rzuci błąd (np. 400), jeśli coś pójdzie nie tak
	}

	/**
	 * Funkcja wylogowania
	 */
	const logoutUser = () => {
		setAuthTokens(null)
		setUser(null)
		localStorage.removeItem('authTokens')
	}

	/**
	 * Kontekst, który udostępnimy komponentom
	 */
	const contextData = {
		user: user,
		authTokens: authTokens,
		loginUser: loginUser,
		registerUser: registerUser,
		logoutUser: logoutUser,
	}

	/**
	 * Odświeżanie tokena (obsługa payloadu "refresh")
	 */
	useEffect(() => {
		const updateToken = async () => {
			if (!authTokens) {
				setLoading(false)
				return
			}

			try {
				const response = await axios.post(API_URLS.refresh, {
					refresh: authTokens.refresh,
				})

				if (response.status === 200) {
					const data = response.data
					setAuthTokens(data)
					setUser(jwtDecode(data.access))
					localStorage.setItem('authTokens', JSON.stringify(data))
				}
			} catch (error) {
				// Jeśli refresh token jest nieprawidłowy (np. wygasł), wyloguj
				console.error('Nie udało się odświeżyć tokena', error)
				logoutUser()
			}

			if (loading) {
				setLoading(false)
			}
		}

		// Uruchom odświeżanie przy pierwszym ładowaniu
		if (loading) {
			updateToken()
		}

		// Ustaw interwał do odświeżania tokena co 4 minuty
		const fourMinutes = 1000 * 60 * 4
		const interval = setInterval(updateToken, fourMinutes)
		return () => clearInterval(interval)
	}, [authTokens, loading])

	return <AuthContext.Provider value={contextData}>{loading ? null : children}</AuthContext.Provider>
}
