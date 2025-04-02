import asyncHandler from "express-async-handler";
import Customer from "../models/customerModel.js";
import Business from "../models/businessModel.js";
import bcrypt from "bcrypt";
import { email_regex } from "../utils/regex.js";
import {
  generateCustomerAccessToken,
  generateCustomerRefreshToken,
} from "../utils/functions.js";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { sendEmail } from "../utils/functions.js";
import valid from "card-validator";
import { uploadToCloudinary, deleteImage } from "../utils/cloudinary.js";
import { v4 as uuidv4 } from "uuid";

export const password_regex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

//Successfull login
const successFullLogin = async (res, customer) => {
  const accessToken = generateCustomerAccessToken(customer._id);
  const { refreshToken, unique } = generateCustomerRefreshToken(customer._id);

  customer.refreshTokens.push({
    token: refreshToken,
    unique,
  });
  await customer.save();

  res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
    customer,
  });
};

//Register a new customer
const registerCustomer = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please provide name, email, and password");
  }

  if (!email_regex.test(email)) {
    res.status(400);
    throw new Error("Invalid email");
  }

  if (!password_regex.test(password)) {
    res.status(400);
    throw new Error(
      "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }

  const customerExists = await Customer.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });
  const businessExists = await Business.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });

  if (customerExists || businessExists) {
    res.status(409);
    throw new Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  let imageUrl = "";

  if (req.file) {
    const imageID = uuidv4();
    imageUrl = await uploadToCloudinary(
      req.file.buffer,
      `${process.env.CLOUDINARY_BASE_FOLDER}/customers`,
      imageID
    );
  }

  const customer = await Customer.create({
    name,
    email,
    password: hashedPassword,
    image: imageUrl,
  });

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const subject = "Verify Your Email Address";
  const text = `Your verification code is: ${verificationCode}`;

  const html = `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
				<h2 style="color: #333;">Verify Your Email</h2>
				<p>Thank you for signing up. Please use the code below to verify your email address:</p>
				<div style="font-size: 24px; font-weight: bold; margin: 20px 0; color:rgb(76, 87, 175);">${verificationCode}</div>
				<p>If you didn't request this, please ignore this email.</p>
			</div>
		`;

  const sent = await sendEmail(email, subject, text, html);

  customer.verificationCode = verificationCode;
  await customer.save();

  res.status(201).json({
    success: true,
    sent,
    message: "Customer registered successfully",
  });
});

//Customer login
const loginCustomer = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  if (!email_regex.test(email)) {
    res.status(400);
    throw new Error("Invalid email");
  }

  const customer = await Customer.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  const isMatch = await bcrypt.compare(password, customer.password);

  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid password");
  }

  await successFullLogin(res, customer);
});

//Google login for customers
const googleLoginCustomer = asyncHandler(async (req, res) => {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
  );
  const { code } = req.body;

  if (!code) {
    res.status(400);
    throw new Error("Invalid code");
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
    throw new Error("Invalid email");
  }

  let customer = await Customer.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });

  if (!customer) {
    customer = await Customer.create({
      name: payload?.name,
      email,
      image: payload?.picture,
      phone: "",
      address: "",
      creditCard: {},
      rating: 0,
    });
  }

  await successFullLogin(res, customer);
});

//Update customer profile
const updateCustomer = asyncHandler(async (req, res) => {
  const { name, email, phone, address, image, creditCard, rating, imageDeleteFlag } = req.body;
  const customer = await Customer.findById(req.customer._id);

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  if (req.file) {
    if (customer.image) {
      await deleteImage(customer.image, true);
    }
    const imageID = uuidv4();
    const imageUrl = await uploadToCloudinary(
      req.file.buffer,
      `${process.env.CLOUDINARY_BASE_FOLDER}/customers`,
      imageID
    );
    customer.image = imageUrl;
  }else if (imageDeleteFlag) {
    if (customer.image) {
      await deleteImage(customer.image, true);
    }
    customer.image = "";
  }

  if (name) customer.name = name;
  if (email && email_regex.test(email)) customer.email = email;
  if (phone) customer.phone = phone;
  if (address) customer.address = address;
  if (creditCard) customer.creditCard = creditCard;
  if (rating !== undefined) customer.rating = rating;

  await customer.save();

  res.status(200).json({
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

//Update customer password
const updateCustomerPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const customer = await Customer.findById(req.customer._id);

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  customer.password = hashedPassword;
  await customer.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

//Delete customer account
const deleteCustomer = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.customer._id);

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  if (customer.image) {
    await deleteImage(customer.image, true);
  }

  await customer.deleteOne();

  res.status(200).json({
    success: true,
    message: "Customer account deleted successfully",
  });
});

//Get customer by ID
const getCustomerById = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.params.id).select("-password");

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  res.status(200).json({
    success: true,
    customer,
  });
});

//Refreshtoken
const refreshTokens = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    res.status(400);
    throw new Error("Refresh token is required");
  }

  console.log("Using secret:", process.env.JWT_SECRET_REFRESH_COSTUMER);

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_COSTUMER);
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }

  const customer = await Customer.findById(decoded.id);
  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  // Check if the refresh token exists in DB
  const storedToken = customer.refreshTokens.find(
    (entry) => entry.token === refreshToken
  );

  if (!storedToken) {
    res.status(403);
    throw new Error("Refresh token not recognized");
  }

  // Remove the old token
  customer.refreshTokens = customer.refreshTokens.filter(
    (entry) => entry.token !== refreshToken
  );

  // Generate new tokens
  const newAccessToken = generateCustomerAccessToken(customer._id);
  const { refreshToken: newRefreshToken, unique } =
    generateCustomerRefreshToken(customer._id);

  // Store new refresh token
  customer.refreshTokens.push({ token: newRefreshToken, unique });
  await customer.save();

  res.status(200).json({
    success: true,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  });
});

const updateCustomerCreditCard = asyncHandler(async (req, res) => {
  const { number, expiry, cvv, cardHolderName } = req.body;

  if (!number || !expiry || !cvv || !cardHolderName) {
    res.status(400);
    throw new Error("Missing credit card details");
  }

  const numberValidation = valid.number(number);
  const expiryValidation = valid.expirationDate(expiry);
  const cvvValidation = valid.cvv(cvv);

  if (
    !numberValidation.isValid ||
    !expiryValidation.isValid ||
    !cvvValidation.isValid
  ) {
    res.status(401);
    throw new Error("Invalid credit card information");
  }

  const customer = await Customer.findById(req.customer._id);
  if (!customer) {
    res.status(402);
    throw new Error("Customer not found");
  }

  customer.creditCard = {
    number: `**** **** **** ${number.slice(-4)}`,
    expiry,
    cardHolderName,
    cardType: numberValidation.card?.niceType || "Unknown",
  };

  customer.isPaymentValid = true;

  if (customer.isEmailValid) {
    customer.isValid = true;
  }

  await customer.save();

  res.status(200).json({
    success: true,
    valid: customer.isValid,
    message: "Credit card updated successfully",
    card: customer.creditCard,
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const customer = await Customer.findById(req.customer._id);

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  if (customer.verificationCode !== code) {
    res.status(401);
    throw new Error("Invalid verification code");
  }

  customer.isEmailValid = true;

  if (customer.isPaymentValid) {
    customer.isValid = true;
  }

  await customer.save();

  res.status(200).json({
    success: true,
    valid: customer.isValid,
    message: "Email verified successfully",
  });
});

const resendVerificationCode = asyncHandler(async (req, res) => {
  const customer = await Customer.findById(req.customer._id);

  if (!customer) {
    res.status(404);
    throw new Error("Customer not found");
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();
  const subject = "Resend Verification Code";
  const text = `Your new verification code is: ${verificationCode}`;

  const html = `
		<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
			<h2 style="color: #333;">Verify Your Email</h2>
			<p>Thank you for signing up. Please use the code below to verify your email address:</p>
			<div style="font-size: 24px; font-weight: bold; margin: 20px 0; color:rgb(76, 87, 175);">${verificationCode}</div>
			<p>If you didn't request this, please ignore this email.</p>
		</div>
		`;

  const sent = await sendEmail(customer.email, subject, text, html);

  customer.verificationCode = verificationCode;
  await customer.save();

  res.status(200).json({
    success: true,
    sent,
    message: "Verification code resent successfully",
  });
});

export {
  registerCustomer,
  loginCustomer,
  googleLoginCustomer,
  updateCustomer,
  deleteCustomer,
  updateCustomerPassword,
  getCustomerById,
  refreshTokens,
  updateCustomerCreditCard,
  verifyEmail,
  resendVerificationCode
};
