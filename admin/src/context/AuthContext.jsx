import { createContext, useContext, useState } from 'react';

// Create the provider
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(
		() => localStorage.getItem('isAuthenticated') === 'true'
	);

	// Login function
	const login = () => {
		localStorage.setItem('isAuthenticated', 'true');
		setIsAuthenticated(true);
	};

	// Logout function
	const logout = () => {
		localStorage.removeItem('accessToken');
		localStorage.removeItem('refreshToken');
		localStorage.removeItem('expiresAt');
		localStorage.removeItem('user');
		localStorage.setItem('isAuthenticated', 'false');
		setIsAuthenticated(false);
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

// Create a custom hook for consuming the context
export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
