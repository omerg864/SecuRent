import asyncHandler from 'express-async-handler';
import Business from '../models/businessModel.js';
import bcrypt from 'bcrypt';
import { email_regex } from '../utils/regex.js';
import { generateBusinessAccessToken, generateBusinessRefreshToken } from '../utils/functions.js';
import { OAuth2Client } from 'google-auth-library';

export const password_regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


// Register a new business
const registerBusiness = asyncHandler(async (req, res) => {
    const { name, email, password, phone, category, bank, address, image, currency, rating } = req.body;

    if (!name || !email || !password || !phone || !category || !bank || !address || !image || !currency || rating === undefined) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (!email_regex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!password_regex.test(password)) {
        return res.status(400).json({ message: 'Password is not strong enough' });
    }

    const businessExists = await Business.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (businessExists) {
        return res.status(400).json({ message: 'Business already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const business = await Business.create({
        name,
        email,
        password: hashedPassword,
        phone,
        category,
        bank,
        address,
        image,
        currency,
        rating,
    });

    return res.status(201).json({
        success: true,
        message: 'Business registered successfully',
    });
});

// Business login
const loginBusiness = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password' });
    }

    const business = await Business.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (!business) {
        return res.status(404).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, business.password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    const accessToken = generateBusinessAccessToken(business._id);
    const refreshToken = generateBusinessRefreshToken(business._id);

    return res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
        business: {
            name: business.name,
            email: business.email,
            phone: business.phone,
            address: business.address,
            image: business.image,
            category: business.category,
            currency: business.currency,
            rating: business.rating,
        },
    });
});

// Google login for business
const googleLoginBusiness = asyncHandler(async (req, res) => {
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET, 'postmessage');
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'No code provided' });
    }

    const response = await client.getToken(code);
    const ticket = await client.verifyIdToken({
        idToken: response.tokens.id_token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;

    if (!email) {
        return res.status(400).json({ message: 'Invalid email' });
    }

    let business = await Business.findOne({ email: new RegExp(`^${email}$`, 'i') });

    if (!business) {
        business = await Business.create({
            name: payload?.name,
            email,
            image: payload?.picture,
            phone: '',
            category: [],
            bank: {},
            address: '',
            currency: '',
            rating: 0,
        });
    }

    const accessToken = generateBusinessAccessToken(business._id);
    const refreshToken = generateBusinessRefreshToken(business._id);

    return res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
        business,
    });
});

// Update business profile
const updateBusiness = asyncHandler(async (req, res) => {
    const { name, email, phone, category, bank, address, image, currency, rating } = req.body;
    const business = await Business.findById(req.business._id);

    if (!business) {
        return res.status(404).json({ message: 'Business not found' });
    }

    if (name) business.name = name;
    if (email && email_regex.test(email)) business.email = email;
    if (phone) business.phone = phone;
    if (category) business.category = category;
    if (bank) business.bank = bank;
    if (address) business.address = address;
    if (image) business.image = image;
    if (currency) business.currency = currency;
    if (rating !== undefined) business.rating = rating;

    await business.save();

    return res.status(200).json({ success: true, business });
});

// Delete business account
const deleteBusiness = asyncHandler(async (req, res) => {
    const business = await Business.findById(req.business._id);

    if (!business) {
        return res.status(404).json({ message: 'Business not found' });
    }

    await Business.findByIdAndDelete(req.business._id);

    return res.status(200).json({
        success: true,
        message: 'Business account deleted successfully',
    });
});

export { registerBusiness, loginBusiness, googleLoginBusiness, updateBusiness, deleteBusiness };
