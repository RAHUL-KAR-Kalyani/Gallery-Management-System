const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const albumModel = require("../models/albumModel");
const imageModel = require("../models/imageModel");
const jwt = require("jsonwebtoken");

const registerUserService = async ({ name, email, password, role }) => {

    const normalizedEmail = email.toLowerCase();

    // check existing user
    const existingUser = await userModel.findOne({ email: normalizedEmail });

    if (existingUser) {
        const error = new Error("User already exists");
        error.statusCode = 400;
        throw error;
    }

    // hash password
    const saltRounds = Number(process.env.SALT) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create user
    const user = await userModel.create({
        name,
        email: normalizedEmail,
        password: hashedPassword,
        role
    });

    return user;
};

const loginUserService = async ({ email, password, role }) => {

    const normalizedEmail = email.toLowerCase();

    const user = await userModel.findOne({ email: normalizedEmail });
    if (!user) {
        const error = new Error("Invalid credentials");
        error.statusCode = 400;
        throw error;
    }

    if (user.role !== role) {
        const error = new Error("Invalid role");
        error.statusCode = 400;
        throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        const error = new Error("Invalid credentials");
        error.statusCode = 400;
        throw error;
    }

    // generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return {
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};

const profileService = async (userId) => {

    const user = await userModel.findById(userId).select("-password");

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    return user;
};

const getUserDashboardStatsService = async (userId) => {
    const [totalAlbums, totalImages] = await Promise.all([
        albumModel.countDocuments({ createdBy: userId }),
        imageModel.countDocuments({ uploadedBy: userId })
    ]);

    return { totalAlbums, totalImages };
};



module.exports = { registerUserService, loginUserService, profileService, getUserDashboardStatsService };