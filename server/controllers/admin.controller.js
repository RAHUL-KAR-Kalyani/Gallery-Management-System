const { getDashboardStatsService, getImageCountPerUserService, getAdminDashboardStatsService } = require("../services/adminService");

const getDashboardStats = async (req, res) => {
    try {
        const stats = await getDashboardStatsService();

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

const getAdminDashboardStats = async (req, res) => {
    try {
        const stats = await getAdminDashboardStatsService();

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

const getImageCountPerUser = async (req, res) => {
    try {
        const analytics =
            await getImageCountPerUserService();

        return res.status(200).json({
            success: true,
            analytics
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = { getDashboardStats, getImageCountPerUser, getAdminDashboardStats };