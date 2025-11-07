import React, { useState, useContext } from 'react'
import Modal from './Modal'
import LoginForm from './LoginForm'
import RegistrationForm from './RegistrationForm'
import AuthContext from '../context/AuthContext' // Importujemy kontekst

function HomePage() {
	const [modalOpen, setModalOpen] = useState(null)

	// Pobieramy dane użytkownika i funkcję wylogowania z kontekstu
	const { user, logoutUser } = useContext(AuthContext)

	const closeModal = () => setModalOpen(null)

	return (
		<div style={{ padding: '20px' }}>
			<h1>Witaj na Stronie Głównej</h1>

			{/* === ZMIANA: Renderowanie warunkowe === */}
			{user ? (
				<div>
					{/* Użytkownik jest zalogowany */}
					<p>Jesteś zalogowany jako: **{user.email || 'Użytkownik'}**</p> {/* Zakładamy, że token ma pole 'email' */}
					<button onClick={logoutUser}>Wyloguj</button>
				</div>
			) : (
				<div>
					{/* Użytkownik nie jest zalogowany */}
					<p>Proszę się zalogować lub zarejestrować.</p>
					<button onClick={() => setModalOpen('login')}>Logowanie</button>
					<button onClick={() => setModalOpen('register')} style={{ marginLeft: '10px' }}>
						Rejestracja
					</button>
				</div>
			)}
			{/* ======================================= */}

			{/* Modal Logowania */}
			<Modal isOpen={modalOpen === 'login'} onClose={closeModal} title='Zaloguj się'>
				{/* Przekazujemy funkcję zamykającą, by formularz mógł zamknąć modal po sukcesie */}
				<LoginForm onSuccess={closeModal} />
			</Modal>

			{/* Modal Rejestracji */}
			<Modal isOpen={modalOpen === 'register'} onClose={closeModal} title='Utwórz konto'>
				<RegistrationForm onSuccess={() => setModalOpen('login')} />
			</Modal>
		</div>
	)
}

export default HomePage
