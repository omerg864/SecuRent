export const CHARGED_SCORE = 5; // Default charged score
export const CHARGED_WEIGHT = 0.7; // Weight for charged score in overall rating calculation
export const REVIEW_WEIGHT = 0.3; // Weight for review score in overall rating calculation

export const REPORT_STATUS = {
	OPEN: 'open',
	RESOLVED: 'resolved',
	REJECTED: 'rejected',
};

export const REPORT_RESOLUTION = { ...REPORT_STATUS, OPEN: undefined };

export const REPORT_LIMIT_PER_PAGE = 15; // Default limit for report pagination

export const NOTIFICATION_LIMIT_PER_PAGE = 8; // Default limit for admin notification pagination

export const CHARGED_PERCENT_NOTIFICATION = 66;

export const APP_NAME = 'secuRent';
export const APP_URL = `secuRent://`;
export const ITEM_NAME = 'item';
export const TRANSACTION_NAME = 'transaction';