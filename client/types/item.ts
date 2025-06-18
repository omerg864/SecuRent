export interface Item {
	_id: string;
	business: string;
	description: string;
	price: number;
	smartPrice?: boolean;
	currency: string;
	image?: string;
	return_date?: string | null;
	duration?: number | null;
	timeUnit?: 'days' | 'minutes' | 'hours';
	temporary?: boolean;
	createdAt?: string | Date;
	updatedAt?: string | Date;
}
