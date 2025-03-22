import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';

export const generateAdminAccessToken = (id) => {
	const unique = uuid();
	return jwt.sign({ id, unique }, process.env.JWT_SECRET_ADMIN_ACCESS, {
		expiresIn: '1d',
	});
};

export const generateAdminRefreshToken = (id) => {
	const unique = uuid();
	return {
		refreshToken: jwt.sign({ id, unique }, process.env.JWT_SECRET_ADMIN_REFRESH, {
			expiresIn: '7d',
		}),
		unique,
	};
};

export const decodeAdminToken = (token) => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN_ACCESS);
		return decoded.id;
	} catch (error) {
		return null;
	}
}

export const decodeCustomerToken = (token) => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_CUSTOMER_ACCESS);
		return decoded.id;
	} catch (error) {
		return null;
	}
}

export const decodeBusinessToken = (token) => {
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET_BUSINESS_ACCESS);
		return decoded.id;
	} catch (error) {
		return null;
	}
}

