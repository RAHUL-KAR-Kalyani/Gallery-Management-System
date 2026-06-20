const express = require('express');
const isAuth = require('../middleware/authMiddleware');
const validateMiddleware = require('../middleware/validateMiddleware');
const { registerSchema, loginSchema } = require('../validations/userValidation');
const { registerController, loginController, profileController, logoutController, getUserDashboardStats } = require('../controllers/user.controller');
const roleMiddleware = require('../middleware/roleMiddleware');


const userRouter = express.Router();

userRouter.post('/register', validateMiddleware(registerSchema), registerController);
userRouter.post('/login', validateMiddleware(loginSchema), loginController);
userRouter.get('/profile', isAuth, profileController);
userRouter.get('/logout', isAuth, logoutController);
userRouter.get("/dashboard", isAuth, roleMiddleware(["user", "admin"]), getUserDashboardStats);

module.exports = userRouter;