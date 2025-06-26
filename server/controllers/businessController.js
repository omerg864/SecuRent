import asyncHandler from "express-async-handler";
import Business from "../models/businessModel.js";
import Customer from "../models/customerModel.js";
import Item from "../models/itemModel.js";
import Review from "../models/reviewModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { email_regex, password_regex, phone_regex } from "../utils/regex.js";
import {
	generateBusinessAccessToken,
	generateBusinessRefreshToken,
} from '../utils/functions.js';
import { OAuth2Client } from 'google-auth-library';
import { sendEmail } from '../utils/functions.js';
import { verifyCompanyNumber } from '../utils/externalFunctions.js';
import { uploadToCloudinary, deleteImage } from '../utils/cloudinary.js';
import { v4 as uuidv4 } from 'uuid';
import stripe from '../config/stripe.js';
import Transaction from '../models/transactionModel.js';


//Reusable login success function
const successFullLogin = async (res, business) => {
  const accessToken = generateBusinessAccessToken(business._id);
  const { refreshToken, unique } = generateBusinessRefreshToken(business._id);

  if (!business.refreshTokens) business.refreshTokens = [];
  business.refreshTokens.push({ token: refreshToken, unique });
  await business.save();

  res.status(200).json({
    success: true,
    accessToken,
    refreshToken,
    business,
  });
};

//Register
const registerBusiness = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  console.log("req.body", req.body);

  if (!name || !email || !password) {
    console.log("Please fill in all fields");
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  if (!email_regex.test(email)) {
    console.log("Invalid email format");
    res.status(401);
    throw new Error("Invalid email format");
  }

  if (!password_regex.test(password)) {
    console.log("Password is not strong enough");
    res.status(402);
    throw new Error("Password is not strong enough");
  }

  const businessExists = await Business.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });
  const customerExists = await Customer.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });

  if (businessExists || customerExists) {
    console.log("Email already in use");
    res.status(403);
    throw new Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log("req.file", req.file);

  let imageUrl = "";
  if (req.file) {
    const imageID = uuidv4();
    imageUrl = await uploadToCloudinary(
      req.file.buffer,
      `${process.env.CLOUDINARY_BASE_FOLDER}/businesses`,
      imageID
    );
  }

  console.log("imageUrl", imageUrl);

  const business = await Business.create({
    name,
    email,
    password: hashedPassword,
    image: imageUrl || undefined,
  });

  console.log("business", business);

  const stripeAccount = await stripe.accounts.create({
    type: "express",
    country: "US",
    email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  console.log("stripeAccount", stripeAccount);

  business.stripe_account_id = stripeAccount.id;

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

  business.verificationCode = verificationCode;
  await business.save();

  res.status(201).json({
    success: true,
    sent,
    message: "Business registered successfully",
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { code, userId } = req.body;
  const business = await Business.findById(userId);

  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  if (code !== business.verificationCode) {
    res.status(401);
    throw new Error("Invalid verification code");
  }

  business.isEmailValid = true;
  if (business.isCompanyNumberVerified && business.isBankValid) {
    business.isValid = true;
  }

  const accessToken = generateBusinessAccessToken(business._id);
  console.log("accessToken", accessToken);
  const { refreshToken, unique } = generateBusinessRefreshToken(business._id);
  if (!business.refreshTokens) business.refreshTokens = [];
  business.refreshTokens.push({ token: refreshToken, unique: true });
  await business.save();

  res.status(200).json({
    success: true,
    valid: business.isValid,
    message: "Email verified successfully",
    accessToken,
    refreshToken,
  });
});

//Login
const loginBusiness = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please fill in all fields");
  }

  const business = await Business.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });

  if (!business) {
    res.status(404);
    throw new Error("Invalid email or password");
  }

  const isMatch = await bcrypt.compare(password, business.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  await successFullLogin(res, business);
});

//Refresh Token
const refreshTokens = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400);
    throw new Error("Refresh token is required");
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET_REFRESH_BUSINESS);
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }

  const business = await Business.findById(decoded.id);
  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  const storedToken = business.refreshTokens?.find(
    (t) => t.token === refreshToken
  );
  if (!storedToken) {
    res.status(403);
    throw new Error("Refresh token not recognized");
  }

  business.refreshTokens = business.refreshTokens.filter(
    (t) => t.token !== refreshToken
  );

  const accessToken = generateBusinessAccessToken(business._id);
  const { refreshToken: newRefreshToken, unique } =
    generateBusinessRefreshToken(business._id);
  business.refreshTokens.push({ token: newRefreshToken, unique });

  await business.save();

  res.status(200).json({
    success: true,
    accessToken,
    refreshToken: newRefreshToken,
  });
});

//Google Login
const googleLoginBusiness = asyncHandler(async (req, res) => {
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
    res.status(401);
    throw new Error("Invalid email");
  }

  let business = await Business.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });

  if (!business) {
    business = await Business.create({
      name: payload?.name,
      email,
      image: payload?.picture,
      phone: "",
      category: [],
      bank: {},
      address: "",
      currency: "",
      rating: 0,
    });
  }

  await successFullLogin(res, business);
});

//Update Business
const updateBusiness = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    phone,
    category,
    address,
    imageDeleteFlag,
    currency,
    rating,
  } = req.body;

  const business = await Business.findById(req.business._id);
  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  if (req.file) {
    if (business.image) {
      await deleteImage(business.image, true);
    }
    const imageID = uuidv4();
    const imageUrl = await uploadToCloudinary(
      req.file.buffer,
      `${process.env.CLOUDINARY_BASE_FOLDER}/businesses`,
      imageID
    );
    business.image = imageUrl;
  } else if (imageDeleteFlag) {
    if (business.image) {
      await deleteImage(business.image, true);
    }
    business.image = "";
  }

  if (name) business.name = name;
  if (email && email_regex.test(email)) business.email = email;
  if (phone) business.phone = phone;
  if (category) business.category = category;
  if (address) business.address = address;
  if (currency) business.currency = currency;
  if (rating !== undefined) business.rating = rating;

  await business.save();

  return res.status(200).json({ success: true, business });
});

//Delete
const deleteBusiness = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.business._id);
  if (!business) {
    return res.status(404).json({ message: "Business not found" });
  }

  if (business.image) {
    await deleteImage(business.image, true);
  }

  await business.deleteOne();
  res.status(200).json({
    success: true,
    message: "Business account deleted successfully",
  });
});

//Get Business By ID
const getBusinessById = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.params.id);
  if (!business) {
    return res.status(404).json({ message: "Business not found" });
  }

  res.status(200).json({ success: true, business });
});

const updateBusinessDetails = asyncHandler(async (req, res) => {
  const { companyNumber, address, location, phone, currency, category } =
    req.body;

  if (!companyNumber || !address || !location || !phone || !currency) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (!phone_regex.test(phone)) {
    res.status(401);
    throw new Error("Invalid phone number format");
  }

  if (
    location.coordinates[0] === undefined ||
    location.coordinates[1] === undefined ||
    location.type !== "Point"
  ) {
    res.status(401);
    throw new Error("Location invalid");
  }

  const isBusiness = await Business.findOne({ companyNumber });
  if (isBusiness && isBusiness._id.toString() !== req.business._id.toString()) {
    res.status(401);
    throw new Error("Business already exists");
  }

  const verification = await verifyCompanyNumber(companyNumber);
  if (!verification) {
    res.status(402);
    throw new Error("Company number not found in official registry");
  }

  const business = await Business.findById(req.business._id);

  let imageUrl = "";
  if (req.file) {
    if (business.image) {
      await deleteImage(business.image, true);
    }
    const imageID = uuidv4();
    imageUrl = await uploadToCloudinary(
      req.file.buffer,
      `${process.env.CLOUDINARY_BASE_FOLDER}/businesses`,
      imageID
    );
    business.image = imageUrl;
  }

  business.companyNumber = companyNumber;
  business.address = address;
  business.location = location;
  business.phone = phone;
  business.currency = currency;
  business.category = category || [];
  business.isCompanyNumberVerified = true;
  if (business.isEmailValid && business.isBankValid) {
    business.isValid = true;
  }
  await business.save();

  res.status(200).json({
    success: true,
    valid: business.isValid,
    message: "Company verified and updated successfully",
    company: verification,
  });
});

const updateBusinessAccount = asyncHandler(async (req, res) => {
  const {
    companyNumber,
    address,
    phone,
    currency,
    name,
    email,
    imageDeleteFlag,
  } = req.body;
  let { category = "[]", location } = req.body;

  const categoryArray = JSON.parse(category);

  if (!Array.isArray(categoryArray)) {
    res.status(400);
    throw new Error("Category must be an array");
  }
  category = categoryArray.map((cat) => cat.trim()).filter(Boolean);

  if (category.every((cat) => typeof cat !== "string")) {
    res.status(400);
    throw new Error("Category must contain only strings");
  }

  if (
    !companyNumber ||
    !address ||
    !location ||
    !phone ||
    !currency ||
    !name ||
    !email
  ) {
    res.status(400);
    throw new Error("All fields are required");
  }

  if (!phone_regex.test(phone)) {
    res.status(401);
    throw new Error("Invalid phone number format");
  }

  if (!email_regex.test(email)) {
    res.status(401);
    throw new Error("Invalid email format");
  }

  const geoLocation = JSON.parse(location);

  if (
    geoLocation.coordinates[0] === undefined ||
    geoLocation.coordinates[1] === undefined ||
    geoLocation.type !== "Point"
  ) {
    res.status(401);
    throw new Error("Location invalid");
  }

  let isBusiness = await Business.findOne({ companyNumber });
  if (isBusiness && isBusiness._id.toString() !== req.business._id.toString()) {
    res.status(401);
    throw new Error("Business already exists");
  }

  isBusiness = await Business.findOne({
    email: new RegExp(`^${email}$`, "i"),
  });
  if (isBusiness && isBusiness._id.toString() !== req.business._id.toString()) {
    res.status(401);
    throw new Error("Email already in use");
  }

  const verification = await verifyCompanyNumber(companyNumber);
  if (!verification) {
    res.status(402);
    throw new Error("Company number not found in official registry");
  }

  const business = await Business.findById(req.business._id);

  if (req.file) {
    if (business.image) {
      await deleteImage(business.image, true);
    }
    const imageID = uuidv4();
    const imageUrl = await uploadToCloudinary(
      req.file.buffer,
      `${process.env.CLOUDINARY_BASE_FOLDER}/businesses`,
      imageID
    );
    business.image = imageUrl;
  } else if (imageDeleteFlag) {
    if (business.image) {
      await deleteImage(business.image, true);
    }
    business.image = "";
  }

  business.companyNumber = companyNumber;
  business.address = address;
  business.location = geoLocation;
  business.phone = phone;
  business.currency = currency;
  business.category = category || [];
  business.isCompanyNumberVerified = true;
  business.name = name;
  business.email = email;
  if (business.isEmailValid && business.isBankValid) {
    business.isValid = true;
  }
  await business.save();

  res.status(200).json({
    success: true,
    business,
  });
});

const verifyBank = asyncHandler(async (req, res) => {
  if (!req.business.stripe_account_id) {
    res.status(400);
    throw new Error("Stripe account not found for this business");
  }

  const account = await stripe.accounts.retrieve(
    req.business.stripe_account_id
  );

  if (account.requirements.currently_due.length > 0) {
    res.status(400);
    throw new Error("Bank account not verified yet");
  }

  const business = await Business.findById(req.business._id);

  business.isBankValid = true;
  if (business.isEmailValid && business.isCompanyNumberVerified) {
    business.isValid = true;
  }
  await business.save();

  res.status(200).json({
    success: true,
    valid: business.isValid,
    message: "Bank verified and updated successfully",
  });
});

const updateBusinessPassword = asyncHandler(async (req, res) => {
  const { newPassword } = req.body;
  const business = await Business.findById(req.business._id);

  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

  const salt = await bcrypt.genSalt(10);
  business.password = await bcrypt.hash(newPassword, salt);
  await business.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
});

const resendVerificationCode = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const business = await Business.findById(userId);

  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }

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

  const sent = await sendEmail(business.email, subject, text, html);

  business.verificationCode = verificationCode;
  await business.save();

  res.status(200).json({
    success: true,
    sent,
    message: "Verification code resent successfully",
  });
});

const getStripeOnboardingLink = asyncHandler(async (req, res) => {
  if (!req.business.stripe_account_id) {
    res.status(400);
    throw new Error("Stripe account not found for this business");
  }

  const accountLink = await stripe.accountLinks.create({
    account: req.business.stripe_account_id,
    refresh_url: `${process.env.CLIENT_URL}/business/stripe-setup-failed`,
    return_url: `${process.env.CLIENT_URL}/business/stripe-setup-success`,
    type: "account_onboarding",
  });

  res.status(200).json({
    success: true,
    url: accountLink.url,
  });
});

const getNearbyBusinesses = asyncHandler(async (req, res) => {
  const {
    lat,
    lng,
    radius = 10,
    rating = 0,
    category = "all",
    search = "",
  } = req.query;

  if (isNaN(lat) || isNaN(lng)) {
    res.status(400);
    throw new Error("Latitude and longitude are required");
  }

  if (isNaN(radius) || radius <= 0) {
    res.status(400);
    throw new Error("Invalid radius");
  }

  const businesses = await Business.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [parseFloat(lng), parseFloat(lat)],
        },
        distanceField: "distance", // Distance in meters
        maxDistance: parseFloat(radius) * 1000, // Max distance in meters
        spherical: true,
      },
    },
    // 🛠️ Convert distance from meters to kilometers
    {
      $addFields: {
        distance: { $divide: ["$distance", 1000] }, // meters ➔ kilometers
      },
    },
    { $match: { "rating.overall": { $gte: parseFloat(rating) } } },
    { $match: { activated: true } },
    {
      $match: {
        $or: [{ suspended: { $exists: false } }, { suspended: false }],
      },
    },
    ...(category !== "all"
      ? [
          {
            $match: {
              category: {
                $elemMatch: {
                  $regex: new RegExp(category, "i"),
                },
              },
            },
          },
        ]
      : []),
    ...(search.trim() !== ""
      ? [
          {
            $match: {
              name: {
                $regex: new RegExp(search, "i"),
              },
            },
          },
        ]
      : []),
    // Project only safe fields
    {
      $project: {
        name: 1,
        phone: 1,
        address: 1,
        category: 1,
        image: 1,
        currency: 1,
        rating: 1,
        location: 1,
        distance: 1,
        isValid: 1,
        reviewSummary: 1,
      },
    },
    // Sort by nearest first
    {
      $sort: { distance: 1 },
    },
  ]);

  res.status(200).json({ success: true, businesses });
});

const getBusinessProfile = asyncHandler(async (req, res) => {
  const id = req.params.id;
  const customerId = req.query.customerId;
  console.log("customerId", customerId);
  if (!id) {
    console, log("'Business ID is required");
    res.status(400);
    throw new Error("Business ID is required");
  }
  const business = await Business.findById(id).select(
    "-password -refreshTokens -verificationCode -isValid -isEmailValid -isCompanyNumberVerified -isBankValid"
  );
  if (!business) {
    console.log("Business not found");
    res.status(404);
    throw new Error("Business not found");
  }
  let items = await Item.find({ business: id, temporary: false });
  
  const promises = [];
  promises.push(
    Review.find({ business: id })
      .populate("customer", "name image")
      .select("-business -temporary -updatedAt -__v")
      .sort({ createdAt: -1 })
  );
  const [reviews] = await Promise.all(promises);
  res.status(200).json({ success: true, business, items, reviews });
});

const getBusinessData = asyncHandler(async (req, res) => {
  const business = await Business.findById(req.business._id).select(
    "-password -refreshTokens -verificationCode"
  );
  if (!business) {
    res.status(404);
    throw new Error("Business not found");
  }
  res.status(200).json({ success: true, business });
});

const toggleBusinessActivation = asyncHandler(async (req, res) => {
  const businessOpenTransactionsCount = await Transaction.countDocuments({
    business: req.business._id,
    status: "open",
  });

  if (businessOpenTransactionsCount > 0) {
    res.status(400);
    throw new Error(
      "Cannot change activation status while there are open transactions"
    );
  }

  req.business.activated = !req.business.activated;
  await req.business.save();

  res.status(200).json({
    success: true,
    message: `Business ${
      req.business.activated ? "activated" : "deactivated"
    } successfully`,
    activated: req.business.activated,
  });
});

export {
	registerBusiness,
	loginBusiness,
	refreshTokens,
	googleLoginBusiness,
	updateBusiness,
	deleteBusiness,
	getBusinessById,
	updateBusinessDetails,
	verifyEmail,
	verifyBank,
	updateBusinessPassword,
	resendVerificationCode,
	getStripeOnboardingLink,
	getNearbyBusinesses,
	getBusinessProfile,
	getBusinessData,
	toggleBusinessActivation,
	updateBusinessAccount,
};
