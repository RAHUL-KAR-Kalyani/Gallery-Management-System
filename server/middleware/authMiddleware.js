// const jwt = require('jsonwebtoken');
// /** @type {import("mongoose").Model<any>} */
// const userModel = require('../models/userModel');

// const isAuth = async (req, res, next) => {
//     try {
//         const token = req.cookies.token;

//         if (!token) {
//             return res.status(401).json({
//                 message: "Authentication required. Pls login",
//                 success: false
//             });
//         }

//         const decode = await jwt.verify(token, process.env.JWT_SECRET);
//         if (!decode) {
//             return res.status(401).json({
//                 message: "Invalid token. Pls login again",
//                 success: false
//             });
//         }

//         const user = await userModel.findById(decode.userId);
//         if (!user) {
//             return res.status(401).json({
//                 message: "user not found. Pls login again",
//                 success: false
//             });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             message: "Server error",
//             success: false
//         });
//     }
// }

// module.exports = isAuth;


const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

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

        // req.user = {
        //     userId: decoded.userId
        // };

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