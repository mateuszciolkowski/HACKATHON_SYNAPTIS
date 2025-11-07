import HomePage from './components/HomePage.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

function App() {
	return (
		<>
			<AuthProvider>
				<HomePage />
			</AuthProvider>
		</>
	)
}

export default App
