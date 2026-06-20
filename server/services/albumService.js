const cloudinary = require('../config/cloudinary');
const albumModel = require("../models/albumModel");
const imageModel = require("../models/imageModel");
const streamifier = require('streamifier');
const crypto = require("crypto");


const createAlbumService = async (body, file, userId) => {
    let coverImageUrl = "";
    // upload cover image
    if (file) {
        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "gallery_album",
                    resource_type: "image",
                    transformation: [
                        { quality: "auto" },
                        { fetch_format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
        });
        coverImageUrl = result.secure_url;
    }

    const album = await albumModel.create({
        name: body.name,
        description: body.description,
        coverImage: coverImageUrl,
        createdBy: userId,
        images: body.images
    });

    return album;
};


const getAlbumService = async () => {
    const albums = await albumModel.find().populate("createdBy").populate("images");
    return albums;
}


const getAlbumByIdService = async (id) => {
    const album = await albumModel.findById(id).populate("createdBy").populate("images");
    return album;
};


const getAlbumByUserIdService = async (userId) => {
    const albums = await albumModel.find({ createdBy: userId }).populate("createdBy").populate("images");
    return albums;
}


const updateAlbumService = async (id, body, file) => {
    const album = await albumModel.findById(id);

    if (!album) return null;

    if (body.name) {
        album.name = body.name;
    }

    if (body.description) {
        album.description = body.description;
    }

    if (file) {
        if (album.coverImagePublicId) {
            await cloudinary.uploader.destroy(album.coverImagePublicId);
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "gallery_album",
                    resource_type: "image",
                    transformation: [
                        { quality: "auto" },
                        { fetch_format: "auto" }
                    ]
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            );
            streamifier.createReadStream(file.buffer).pipe(stream);
        });

        album.coverImage = result.secure_url;
        album.coverImagePublicId = result.public_id;
    }

    // add images
    if (body.addImages) {

        let addImages = body.addImages;
        // formData sends string
        if (typeof addImages === "string") {
            addImages = JSON.parse(addImages);
        }

        const uniqueImages = addImages.filter((imgId) => !album.images.some((id) => id.toString() === imgId));
        album.images.push(...uniqueImages);
    }

    if (body.removeImages) {
        let removeImages = body.removeImages;
        if (typeof removeImages === "string") {
            removeImages = JSON.parse(removeImages);
        }
        album.images = album.images.filter((imgId) => !removeImages.includes(imgId.toString()));
    }
    await album.save();
    return album;
};


const deleteAlbumService = async (id) => {
    const album = await albumModel.findById(id);

    if (!album) {
        return null;
    }

    await album.deleteOne();
    return album;
};


const renameAlbumService = async (id, newName) => {
    return await albumModel.findByIdAndUpdate(id, { name: newName }, { returnDocument: "after" });
    // return await albumModel.findByIdAndUpdate(id, { name: newName }, { returnDocument: "after", runValidators: true });
};


const sharableLinkService = async (albumId) => {
    const album = await albumModel.findById(albumId);

    if (!album) return null;

    if (!album.shareToken) {
        album.shareToken = crypto.randomBytes(32).toString("hex");
        await album.save();
    }
    console.log(`${process.env.FRONTEND_URL}/shared/${album.shareToken}, sharableLink`);

    return `${process.env.FRONTEND_URL}/shared/${album.shareToken}`;
};


const getSharedAlbumService = async (token) => {
    const album = await albumModel.findOne({ shareToken: token }).populate("createdBy").populate("images");
    return album;
};



module.exports = { createAlbumService, getAlbumService, getAlbumByIdService, getAlbumByUserIdService, updateAlbumService, deleteAlbumService, renameAlbumService, sharableLinkService, getSharedAlbumService };