const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { registerUserService, loginUserService, profileService, getUserDashboardStatsService } = require('../services/userService');


const registerController = async (req, res) => {
    try {
        const user = await registerUserService(req.body);
        // Create JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });

        return res.status(201).json({
            success: true,
            message: "User registered successfully",
            token
        });

    } catch (err) {
        console.error("Register Error:", err);
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }
};

const loginController = async (req, res) => {
    try {
        const { token, user } = await loginUserService(req.body);

        return res.status(200).cookie("token", token, { httpOnly: true, secure: true, sameSite: "none", maxAge: 24 * 60 * 60 * 1000 }).json({
            success: true,
            message: `Welcome ${user.name}!`,
            user,
            token
        });

    } catch (err) {
        console.error("Login Error:", err);

        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }
};

const profileController = async (req, res) => {
    try {
        console.log("req.user:", req.user);
        const userId = req.user._id;
        console.log("userId:", userId);

        const userProfile = await profileService(userId);
        return res.status(200).json({
            success: true,
            message: "Profile retrieved",
            userProfile: req.user
        });

    } catch (err) {
        console.error("Profile Error:", err);
        return res.status(err.statusCode || 500).json({
            success: false,
            message: err.message
        });
    }
};

const logoutController = async (req, res) => {
    try {
        res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "none" });

        return res.status(200).json({
            success: true,
            message: "Logged out successfully"
        });

    } catch (err) {
        console.error("Logout Error:", err);
        return res.status(500).json({
            success: false,
            message: err.message || "Logout failed"
        });
    }
};


const getUserDashboardStats = async (req, res) => {
    try {
        console.log("req.user =", req.user);
        console.log("req.user.userId =", req.user._id);
        console.log("req.user._id =", req.user._id);

        const stats = await getUserDashboardStatsService(req.user._id);

        return res.status(200).json({
            success: true,
            stats
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { registerController, loginController, profileController, logoutController, getUserDashboardStats }