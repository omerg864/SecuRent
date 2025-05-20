import { Business } from '@/types/business';
import { BUSINESS_DATA } from '@/utils/asyncStorageConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useCallback,
} from 'react';

// Define the context type
type BusinessContextType = {
	business: Business | null;
	setBusiness: (business: Business) => Promise<void>;
	updateBusiness: (updated: Partial<Business>) => Promise<void>;
};

const BusinessContext = createContext<BusinessContextType | undefined>(
	undefined
);

type BusinessProviderProps = {
	children: ReactNode;
};

export const BusinessProvider = ({ children }: BusinessProviderProps) => {
	const [business, setBusinessState] = useState<Business | null>(null);

	useFocusEffect(
		useCallback(() => {
			const fetchBusinessData = async () => {
				try {
					const storedBusinessData = await AsyncStorage.getItem(
						BUSINESS_DATA
					);
					if (storedBusinessData) {
						const parsedBusinessData: Business =
							JSON.parse(storedBusinessData);
						setBusinessState(parsedBusinessData);
					}
				} catch (error) {
					console.error('Error fetching business data:', error);
				}
			};
			fetchBusinessData();

			return () => {
				setBusinessState(null); // Cleanup on unmount
			};
		}, [])
	);

	const updateBusiness = async (updated: Partial<Business>) => {
		if (business) {
			const updatedBusiness = { ...business, ...updated };
			setBusinessState(updatedBusiness);
			await AsyncStorage.setItem(
				BUSINESS_DATA,
				JSON.stringify(updatedBusiness)
			);
		}
	};

	const setBusiness = async (business: Business) => {
		setBusinessState(business);
		await AsyncStorage.setItem(BUSINESS_DATA, JSON.stringify(business));
	};

	return (
		<BusinessContext.Provider
			value={{ business, setBusiness, updateBusiness }}
		>
			{children}
		</BusinessContext.Provider>
	);
};

export const useBusiness = (): BusinessContextType => {
	const context = useContext(BusinessContext);
	if (!context) {
		throw new Error('useBusiness must be used within a BusinessProvider');
	}
	return context;
};
