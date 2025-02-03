import { createContext, useContext, useState } from 'react';

// Create the provider
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(
		() => localStorage.getItem('isAuthenticated') === 'true'
	);

	const [user, setUser] = useState(
		() =>
			localStorage.getItem('user') || {
				_id: '1',
				picture: '',
				name: 'John Doe',
				email: 'john@gmail.com',
				role: 'Admin',
				createdAt: '12/12/2021',
				updatedAt: '12/12/2021',
			}
	);

	// Login function
	const login = () => {
		localStorage.setItem('isAuthenticated', 'true');
		setUser(JSON.parse(localStorage.getItem('user')) || user);
		setIsAuthenticated(true);
	};

	const updateUser = () => {
		setUser(JSON.parse(localStorage.getItem('user')) || user);
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
		<AuthContext.Provider
			value={{ isAuthenticated, login, logout, updateUser, user }}
		>
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
