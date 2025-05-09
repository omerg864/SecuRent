export const CHARGED_SCORE = 5; // Default charged score
export const CHARGED_WEIGHT = 0.7; // Weight for charged score in overall rating calculation
export const REVIEW_WEIGHT = 0.3; // Weight for review score in overall rating calculation

export const REPORT_STATUS = {
	OPEN: 'open',
	RESOLVED: 'resolved',
	REJECTED: 'rejected',
};

export const REPORT_RESOLUTION = { ...REPORT_STATUS, OPEN: undefined };
