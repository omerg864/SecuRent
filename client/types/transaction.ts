export interface Transaction {
	_id: string;
	transaction_id?: string;
	amount: number;
	description: string;
	currency: string;
	status: string;
	business?: {
		_id?: string;
		name?: string;
		image?: string;
	};
	customer?: {
		_id: string;
		name: string;
		image?: string;
		phone?: string;
		email: string;
	};
	charged?: number;
	charged_description?: string;
	createdAt: string;
	updatedAt: string;
	review?: {
		_id?: string;
		image?: string[];
		content?: string;
		createdAt: string;
	};
	opened_at?: string; // ISO date string
	closed_at?: string;
	return_date?: string;
	item?: string;
}
