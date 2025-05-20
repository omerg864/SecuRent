export interface FileObject {
	uri: string;
	name: string; // or use the file name if available
	type: string; // or use asset.mimeType if available
}

export interface Business {
	_id: string;
	name: string;
	email: string;
	phone: string;
	address: string;
	location: {
		type: string;
		coordinates: [number, number]; // [longitude, latitude]
	};
	distance?: number;
	createdAt: Date;
	updatedAt: Date;
	image: string;
	rating: {
		overall: number;
		reviewOverall: number;
		reliability: number;
		quality: number;
		price: number;
		charged: number;
	};
	role: string;
	category: string[];
	currency: string;
	verificationCode: string;
	isValid: boolean;
	isEmailValid: boolean;
	isBankValid: boolean;
	companyNumber: string;
	reviewSummary: string;
	isCompanyNumberVerified: boolean;
	bank: {
		accountNumber: string;
		sortCode: string;
		accountHolderName: string;
		bankName: string;
	};
	suspended: boolean;
}
