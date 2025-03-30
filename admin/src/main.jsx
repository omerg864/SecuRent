import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import './satoshi.css';
import App from './App.jsx';
import 'jsvectormap/dist/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AuthProvider>
			<GoogleOAuthProvider
				clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
			>
				<Router>
					<App />
				</Router>
			</GoogleOAuthProvider>
		</AuthProvider>
	</StrictMode>
);
