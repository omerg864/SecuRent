import { Customer } from '@/types/customer';
import { CUSTOMER_DATA } from '@/utils/asyncStorageConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import React, {
	createContext,
	useState,
	useContext,
	ReactNode,
	useCallback,
    useEffect,
} from 'react';

// Define the context type
type CustomerContextType = {
	customer: Customer | null;
	setCustomer: (customer: Customer) => Promise<void>;
	updateCustomer: (updated: Partial<Customer>) => Promise<void>;
};

const CustomerContext = createContext<CustomerContextType | undefined>(
	undefined
);

type CustomerProviderProps = {
	children: ReactNode;
};

export const CustomerProvider = ({ children }: CustomerProviderProps) => {
	const [customer, setCustomerState] = useState<Customer | null>(null);

	useFocusEffect(
		useCallback(() => {
			const fetchCustomerData = async () => {
				try {
					const storedCustomerData = await AsyncStorage.getItem(
						CUSTOMER_DATA
					);
					if (storedCustomerData) {
						const parsedCustomerData: Customer =
							JSON.parse(storedCustomerData);
                            setCustomerState(parsedCustomerData);
					}
				} catch (error) {
					console.error('Error fetching customer data:', error);
				}
			};
			fetchCustomerData();

			return () => {
				setCustomerState(null); // Cleanup on unmount
			};
		}, [])
	);

	const updateCustomer = async (updated: Partial<Customer>) => {
		if (customer) {
			const updatedCustomer = { ...customer, ...updated };
			setCustomerState(updatedCustomer);
			await AsyncStorage.setItem(
				CUSTOMER_DATA,
				JSON.stringify(updatedCustomer)
			);
		}
	};

    const setCustomer = async (customer: Customer) => {
        setCustomerState(customer);
        await AsyncStorage.setItem(CUSTOMER_DATA, JSON.stringify(customer));
    }

	return (
		<CustomerContext.Provider
			value={{ customer, setCustomer, updateCustomer }}
		>
			{children}
		</CustomerContext.Provider>
	);
};

export const useCustomer = (): CustomerContextType => {
	const context = useContext(CustomerContext);
	if (!context) {
		throw new Error('useCustomer must be used within a CustomerProvider');
	}
	return context;
};
