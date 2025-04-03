import { v4 as uuid } from 'uuid';
import jwt from 'jsonwebtoken';
import { createTransport } from 'nodemailer';

export const sendEmail = async (receiver, subject, text, html) => {
	var transporter = createTransport({
		service: process.env.EMAIL_SERVICE,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	var mailOptions = {
		from: process.env.EMAIL_ADDRESS,
		to: receiver,
		subject: subject,
		text: text,
		html: html,
	};
	let success = false;
	await transporter
		.sendMail(mailOptions)
		.then(() => {
			success = true;
		})
		.catch((err) => {
			console.log(err);
			success = false;
		});
	return success;
};

export const generateAdminAccessToken = (id) => {
	const unique = uuid();
	return jwt.sign({ id, unique }, process.env.JWT_SECRET_ADMIN_ACCESS, {
		expiresIn: '1d',
	});
};

export const generateAdminRefreshToken = (id) => {
	const unique = uuid();
	return {
		refreshToken: jwt.sign(
			{ id, unique },
			process.env.JWT_SECRET_ADMIN_REFRESH,
			{
				expiresIn: '7d',
			}
		),
		unique,
	};
};
export const generateCustomerAccessToken = (id) => {
	const unique = uuid();
	return jwt.sign({ id, unique }, process.env.JWT_SECRET_ACCESS_COSTUMER, {
		expiresIn: '1d',
	});
};

export const generateCustomerRefreshToken = (id) => {
	const unique = uuid();
	const refreshToken = jwt.sign(
		{ id, unique },
		process.env.JWT_SECRET_REFRESH_COSTUMER,
		{
			expiresIn: '7d',
		}
	);
	return { refreshToken, unique };
};

export const generateBusinessAccessToken = (id) => {
	const unique = uuid();
	return jwt.sign({ id, unique }, process.env.JWT_SECRET_ACCESS_BUSINESS, {
		expiresIn: '1d',
	});
};

export const generateBusinessRefreshToken = (id) => {
	const unique = uuid();
	const refreshToken = jwt.sign(
		{ id, unique },
		process.env.JWT_SECRET_REFRESH_BUSINESS,
		{
			expiresIn: '7d',
		}
	);
	return { refreshToken, unique };
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

