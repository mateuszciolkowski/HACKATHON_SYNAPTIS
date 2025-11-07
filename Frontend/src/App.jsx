import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import HomePage from './components/HomePage.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

// Tworzenie motywu MUI
const theme = createTheme({
	palette: {
		primary: {
			main: '#667eea',
		},
		secondary: {
			main: '#764ba2',
		},
	},
	typography: {
		fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
	},
})

function App() {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<AuthProvider>
				<HomePage />
			</AuthProvider>
		</ThemeProvider>
	)
}

export default App
