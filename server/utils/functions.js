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
	return jwt.sign({ id, unique }, process.env.JWT_SECRET_ADMIN_REFRESH, {
		expiresIn: '7d',
	});
};
export const generateCustomerAccessToken = (id) => {
    const unique = uuid();
    return jwt.sign({ id, unique }, process.env.JWT_SECRET_ACCESS_COSTUMER, {
        expiresIn: '1d',
    });
};

export const generateCustomerRefreshToken = (id) => {
    const unique = uuid();
    return jwt.sign({ id, unique }, process.env.JWT_SECRET_REFRESH_COSTUMER, {
        expiresIn: '7d',
    });
};