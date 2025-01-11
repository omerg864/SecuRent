import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextProps {
	loaded: boolean; // Indicates whether fonts are loaded
	setLoaded: (value: boolean) => void; // Setter for `loaded`
}

// Create the context with default values
const AppContext = createContext<AppContextProps | undefined>(undefined);

interface AppProviderProps {
	children: ReactNode;
}

// Provider to wrap the app
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
	const [loaded, setLoaded] = useState(false); // Manage `loaded` state

	return (
		<AppContext.Provider value={{ loaded, setLoaded }}>
			{children}
		</AppContext.Provider>
	);
};

// Custom hook to use the AppContext
export const useAppContext = (): AppContextProps => {
	const context = useContext(AppContext);
	if (!context) {
		throw new Error('useAppContext must be used within an AppProvider');
	}
	return context;
};
