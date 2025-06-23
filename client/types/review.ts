export interface Review {
	_id: string;
	transaction: string;
	business: string;
	customer: string;
	images?: string[];
	rating: {
		overall: number;
		reliability: number;
		price: number;
		quality: number;
	};
	content?: string;
	createdAt: Date;
	updatedAt: Date;
}
