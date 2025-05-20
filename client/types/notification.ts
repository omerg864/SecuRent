export type Notification = {
	id: string;
	business?: string;
	customer?: string;
	content: string;
	createdAt: string;
	isRead: boolean;
	title: string;
	type: 'business' | 'customer' | 'admin';
	updatedAt: string;
};
