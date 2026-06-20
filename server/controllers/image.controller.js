const { uploadImageService, deleteImageService, getAllImagesService, getImageByIdService, updateImageService, getImagesByUserIdService } = require('../services/imageService');

const uploadImage = async (req, res) => {
    try {
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required"
            });
        }
        const image = await uploadImageService(req.file, req.body, req.user.id);
        return res.status(201).json({
            message: "Image uploaded successfully",
            success: true,
            image
        });

    } catch (err) {
        console.log("Image uploaded error: ", err);
        return res.status(500).json({
            error: err.message,
            success: false
        });
    }
};

const deleteImage = async (req, res) => {
    try {
        const image = await deleteImageService(req.params.id);

        if (!image) {
            return res.status(404).json({
                message: "Image not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Image deleted successfully",
            success: true
        });

    } catch (err) {
        return res.status(500).json({
            error: err.message,
            success: false
        });
    }
};

const getAllImages = async (req, res) => {
    try {
        const images = await getAllImagesService();

        return res.status(200).json({
            message: "Images fetched successfully",
            success: true,
            images
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            error: err.message,
            success: false
        });
    }
};

const getImageById = async (req, res) => {
    try {
        const image = await getImageByIdService(req.params.id);

        if (!image) {
            return res.status(404).json({
                message: "Image not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Image fetched successfully",
            success: true,
            image
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            error: err.message,
            success: false
        });
    }
};

const getImagesByUserId = async (req, res) => {
    try {
        const images = await getImagesByUserIdService(req.params.userId);

        return res.status(200).json({
            message: "Images fetched successfully",
            success: true,
            images
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            error: err.message,
            success: false
        });
    }
};

const updateImage = async (req, res) => {
    try {
        const image = await updateImageService(req.params.id, req.body, req.file);

        if (!image) {
            return res.status(404).json({
                message: "Image not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "Image updated successfully",
            success: true,
            image
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: err.message,
            error: err.message,
            success: false
        });
    }
};

module.exports = { uploadImage, deleteImage, getAllImages, getImageById, updateImage, getImagesByUserId };