export type ReportStatus = 'open' | 'resolved' | 'rejected';

export interface Report {
	_id: string;
	business: string ;
	customer: string ;
	images?: string[];
	title: string;
	content?: string;
	status: ReportStatus;
	resolution?: string;
	resolutionDate?: string;
	resolutionBy?: string;
	createdAt: string;
	updatedAt: string;
}