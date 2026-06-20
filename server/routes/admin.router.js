const express = require("express");
const isAuth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {getAdminDashboardStats, getImageCountPerUser} = require("../controllers/admin.controller");

const adminRouter = express.Router();

adminRouter.get("/dashboard", isAuth, roleMiddleware(["admin"]), getAdminDashboardStats);
adminRouter.get("/image-count-per-user", isAuth, roleMiddleware(["admin"]), getImageCountPerUser);

module.exports = adminRouter;