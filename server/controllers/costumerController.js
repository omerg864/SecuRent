import asyncHandler from 'express-async-handler';
import Costumer from '../models/costumerModel.js';
import bcrypt from 'bcrypt';
import { email_regex } from '../utils/regex.js';
import { generateCustomerAccessToken, generateCustomerRefreshToken } from '../utils/functions.js';
import { OAuth2Client } from 'google-auth-library';

export const password_regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Register a new customer
const registerCustomer = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please provide name, email, and password');
    }

    if (!email_regex.test(email)) {
        res.status(401);
        throw new Error('Invalid email');
    }

    if (!password_regex.test(password)) {
        res.status(402);
        throw new Error('Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.');
    }
    const customerExists = await Costumer.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (customerExists) {
        res.status(403);
        throw new Error('Customer already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const customer = await Costumer.create({
        name,
        email,
        password: hashedPassword,

    });

    return res.status(201).json({
        success: true,
        message: 'Customer registered successfully',
    });
});

// Customer login
const loginCustomer = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }

    const customer = await Costumer.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (!customer) {
        res.status(404);
        throw new Error('Customer not found');
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid password');
    }

    const accessToken = generateCustomerAccessToken(customer._id);
    const refreshToken = generateCustomerRefreshToken(customer._id);

    return res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
        customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            image: customer.image,
            rating: customer.rating,
        },
    });
});

// Google login for customers
const googleLoginCustomer = asyncHandler(async (req, res) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');
    const { code } = req.body;

    if (!code) {
        res.status(400);
        throw new Error('Invalid code');
    }

    const response = await client.getToken(code);
    const ticket = await client.verifyIdToken({
        idToken: response.tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;

    if (!email) {
        res.status(400);
        throw new Error('Invalid email');
    }

    let customer = await Costumer.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (!customer) {
        customer = await Costumer.create({
            name: payload?.name,
            email,
            image: payload?.picture,
            phone: '',
            address: '',
            creditCard: {},
            rating: 0,
        });
    }

    const accessToken = generateCustomerAccessToken(customer._id);
    const refreshToken = generateCustomerRefreshToken(customer._id);

    return res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
        customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            image: customer.image,
            rating: customer.rating,
        },
    });
});

// Update customer profile
const updateCustomer = asyncHandler(async (req, res) => {
    const { name, email, phone, address, image, creditCard, rating } = req.body;
    const customer = await Costumer.findById(req.costumer._id);

    if (!customer) {
        res.status(404);
        throw new Error('Customer not found');
    }

    if (name) customer.name = name;
    if (email && email_regex.test(email)) customer.email = email;
    if (phone) customer.phone = phone;
    if (address) customer.address = address;
    if (image) customer.image = image;
    if (creditCard) customer.creditCard = creditCard;
    if (rating !== undefined) customer.rating = rating;

    await customer.save();

    return res.status(200).json({
        success: true,
        customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
            image: customer.image,
            rating: customer.rating,
        },
    });
});

// Delete customer account
const deleteCustomer = asyncHandler(async (req, res) => {
    const customer = await Costumer.findById(req.costumer._id);

    if (!customer) {
        res.status(404);
        throw new Error('Customer not found');
    }

    await customer.deleteOne();

    return res.status(200).json({
        success: true,
        message: 'Customer account deleted successfully',
    });
});

export { registerCustomer, loginCustomer, googleLoginCustomer, updateCustomer, deleteCustomer };
