const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const isAuth = async (req, res, next) => {
    try {
        console.log("Cookies:", req.cookies);
        const token = req.cookies.token;
        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({
                message: 'Authentication required',
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                message: "Invalid token. Pls login again",
                success: false
            });
        }
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                message: "user not found. Pls login again",
                success: false
            });
        }

        req.user = user;

        next();

    } catch (error) {
        console.log(error);
        return res.status(401).json({
            message: 'Invalid or expired token',
            success: false
        });
    }
};
module.exports = isAuth;
