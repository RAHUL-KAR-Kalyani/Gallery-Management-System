const userModel = require("../models/userModel");
const albumModel = require("../models/albumModel");
const imageModel = require("../models/imageModel");

const getDashboardStatsService = async () => {
    const [totalUsers, totalAlbums, totalImages] = await Promise.all([
        userModel.countDocuments(),
        albumModel.countDocuments(),
        imageModel.countDocuments()
    ]);

    return {
        totalUsers,
        totalAlbums,
        totalImages
    };
};

const getAdminDashboardStatsService = async () => {
    const [totalUsers, totalAlbums, totalImages, imageCountPerUser] =
        await Promise.all([
            userModel.countDocuments(),
            albumModel.countDocuments(),
            imageModel.countDocuments(),

            imageModel.aggregate([
                {
                    $group: {
                        _id: "$uploadedBy",
                        imageCount: { $sum: 1 }
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "_id",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$user"
                },
                {
                    $project: {
                        _id: 0,
                        name: "$user.name",
                        imageCount: 1
                    }
                },
                {
                    $sort: {
                        imageCount: -1
                    }
                }
            ])
        ]);

    return {
        totalUsers,
        totalAlbums,
        totalImages,
        imageCountPerUser
    };
};



const getImageCountPerUserService = async () => {
    const analytics = await imageModel.aggregate([
        {
            $group: {
                _id: "$uploadedBy",
                imageCount: {
                    $sum: 1
                }
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                _id: 0,
                userId: "$user._id",
                name: "$user.name",
                email: "$user.email",
                imageCount: 1
            }
        },
        {
            $sort: {
                imageCount: -1
            }
        }
    ]);

    return analytics;
};

module.exports = { getDashboardStatsService, getAdminDashboardStatsService, getImageCountPerUserService };