import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the user type (null or an object with role)
type User = {
	role: 'customer' | 'business';
} | null;

// Define the context type
type AuthContextType = {
	user: User;
	setUser: React.Dispatch<React.SetStateAction<User>>;
};

// Create the AuthContext with proper typing
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define the provider's props
type AuthProviderProps = {
	children: ReactNode;
};

// Create the AuthProvider component
export const AuthProvider = ({ children }: AuthProviderProps) => {
	const [user, setUser] = useState<User>(null);

	return (
		<AuthContext.Provider value={{ user, setUser }}>
			{children}
		</AuthContext.Provider>
	);
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
