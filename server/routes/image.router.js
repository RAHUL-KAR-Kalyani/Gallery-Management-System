const express = require('express');
const upload = require('../middleware/multer');
const isAuth = require('../middleware/authMiddleware');
const { uploadImage, deleteImage, getAllImages, getImageById, getImagesByUserId, updateImage } = require('../controllers/image.controller');
const validateMiddleware = require('../middleware/validateMiddleware');
const { uploadImageSchema, imageIdSchema, updateImageSchema, userIdSchema } = require('../validations/imageValidation');
const roleMiddleware = require('../middleware/roleMiddleware');

const imageRouter = express.Router();

imageRouter.post('/upload', isAuth, roleMiddleware(['admin', 'user']), upload.single('image'), validateMiddleware(uploadImageSchema), uploadImage);
imageRouter.get('/get', isAuth, roleMiddleware(['admin', 'user']), getAllImages);
imageRouter.get('/get/:id', isAuth, roleMiddleware(['admin', 'user']), validateMiddleware(imageIdSchema, "params"), getImageById);
imageRouter.get('/get/user/:userId', isAuth, roleMiddleware(['admin', 'user']), validateMiddleware(userIdSchema, "params"), getImagesByUserId);
imageRouter.delete('/delete/:id', isAuth, roleMiddleware(['admin', 'user']), validateMiddleware(imageIdSchema, "params"), deleteImage);
imageRouter.put('/update/:id', isAuth, roleMiddleware(['admin', 'user']), upload.single('image'), validateMiddleware(imageIdSchema, "params"), validateMiddleware(updateImageSchema), updateImage);
imageRouter.put('/update/:id', isAuth, roleMiddleware(['admin', 'user']), upload.single('image'), validateMiddleware(updateImageSchema), updateImage);

module.exports = imageRouter;