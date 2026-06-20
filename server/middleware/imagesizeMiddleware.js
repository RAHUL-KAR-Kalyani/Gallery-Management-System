const multer = require('multer');

const imagesizeMiddleware = (err, req, res, next) => {

    console.log(err);

    // multer file size error
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "Image size must be less than 5MB",
                success: false
            });
        }
    }

    // invalid file type error
    if (err.message === "Only JPG, JPEG, PNG, and BMP images are allowed") {
        return res.status(400).json({
            message: err.message,
            success: false
        });
    }

    // default server error
    return res.status(500).json({
        message: err.message,
        success: false
    });
};

module.exports = imagesizeMiddleware;