const express = require('express');
const isAuth = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/multer');
const validateMiddleware = require('../middleware/validateMiddleware');
const { createAlbum, getAlbum, getAlbumById, updateAlbum, deleteAlbum, getAlbumByUserId, renameAlbum, sharableLink, getSharedAlbum } = require('../controllers/album.controller');
const { createAlbumSchema, updateAlbumSchema, albumIdSchema, userIdSchema, renameAlbumSchema } = require('../validations/albumValidation');

const albumRouter = express.Router();

albumRouter.post('/create', isAuth, roleMiddleware(['admin', 'user']), upload.single('coverImage'), validateMiddleware(createAlbumSchema), createAlbum);
albumRouter.get('/get', isAuth, roleMiddleware(['admin', 'user']), getAlbum);
albumRouter.get('/get/:id', isAuth, roleMiddleware(['admin', 'user']), validateMiddleware(albumIdSchema, "params"), getAlbumById);
albumRouter.get('/get/user/:userId', isAuth, roleMiddleware(['admin', 'user']), validateMiddleware(userIdSchema, "params"), getAlbumByUserId);
albumRouter.put('/update/:id', isAuth, roleMiddleware(['admin', 'user']), upload.single('coverImage'), validateMiddleware(updateAlbumSchema), updateAlbum);
albumRouter.delete('/delete/:id', isAuth, roleMiddleware(['admin', 'user']), validateMiddleware(albumIdSchema, "params"), deleteAlbum);
albumRouter.put('/rename/:id', isAuth, roleMiddleware(['admin', 'user']), validateMiddleware(renameAlbumSchema), renameAlbum);
albumRouter.get('/sharable-link/:id', isAuth, roleMiddleware(['admin', 'user']), validateMiddleware(albumIdSchema, "params"), sharableLink);
albumRouter.get("/shared/:token", getSharedAlbum);


module.exports = albumRouter;