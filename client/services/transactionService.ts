import { checkToken, client } from './httpClient';
import {
	ChargeDepositPayload,
	TransactionResponse,
	Transaction,
	TransactionIntentResponse,
} from './interfaceService';
const chargeDeposit = async (
	transactionId: string,
	payload: ChargeDepositPayload
): Promise<TransactionResponse> => {
	const accessToken = await checkToken();
	if (!accessToken) {
		throw new Error('No access token available');
	}

	try {
		const response = await client.put(`/charge/${transactionId}`, payload);
		return response.data;
	} catch (error: any) {
		console.error(
			'Charge deposit failed:',
			error.response?.data || error.message
		);
		throw new Error(
			error.response?.data?.message || 'Charge deposit failed'
		);
	}
};

const createTransactionFromItem = async (itemId: string) => {
	try {
		const accessToken = await checkToken();
		console.log('Access Token:', accessToken);
		const response = await client.get<TransactionIntentResponse>(
			`transaction/${itemId}`,
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);
		return response;
	} catch (error) {
		throw error || 'Transaction creation failed.';
	}
};

const getBusinessTransactions = async () => {
	try {
		const accessToken = await checkToken();
		const response = await client.get<{
			success: boolean;
			transactions: Transaction[];
		}>(`transaction/business`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		return response.data;
	} catch (error) {
		throw error || 'Fetching business transactions failed';
	}
};

const getCustomerTransactions = async () => {
	try {
		const accessToken = await checkToken();
		const response = await client.get<{
			success: boolean;
			transactions: Transaction[];
		}>(`transaction/customer`, {
			headers: { Authorization: `Bearer ${accessToken}` },
		});
		return response.data;
	} catch (error) {
		throw error || 'Fetching customer transaction failed';
	}
};

const getTransactionById = async (id: string): Promise<Transaction> => {
	// console.log("🚀 getTransactionById called with:", id);
	const accessToken = await checkToken();
	if (!accessToken) throw new Error('No access token available');

	const response = await client.get<{
		success: boolean;
		transaction: Transaction;
	}>(`transaction/transaction/${id}`, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	// console.log("📦 Transaction response:", response.data);
	return response.data.transaction;
};

const closeTransaction = async (id: string): Promise<Transaction> => {
	const accessToken = await checkToken();
	if (!accessToken) throw new Error('No access token available');

	const response = await client.put<{
		success: boolean;
		transaction: Transaction;
	}>(
		`transaction/close/${id}`,
		{},
		{
			headers: { Authorization: `Bearer ${accessToken}` },
		}
	);

	return response.data.transaction;
};

const confirmTransactionPayment = async (id: string) => {
	try {
		const accessToken = await checkToken();

		console.log('Access Token:', accessToken);

		const response = await client.post<{
			success: boolean;
			transactions: Transaction[];
		}>(
			`transaction/confirm/${id}`,
			{},
			{
				headers: { Authorization: `Bearer ${accessToken}` },
			}
		);

		return response.data;
	} catch (error) {
		throw error || 'Fetching customer transaction failed';
	}
};

export {
	chargeDeposit,
	createTransactionFromItem,
	getBusinessTransactions,
	getCustomerTransactions,
	getTransactionById,
	closeTransaction,
	confirmTransactionPayment,
};
