const cloudinary = require('../config/cloudinary');
const imageModel = require('../models/imageModel');
const albumModel = require('../models/albumModel');
const streamifier = require('streamifier');
const mongoose = require('mongoose');


const uploadImageService = async (file, body, userId) => {

    // upload image to cloudinary
    const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "gallery_app",
                resource_type: "image",
                transformation: [
                    { quality: "auto" },
                    { fetch_format: "auto" }
                ]
            },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
    });

    // validate album id if provided
    let albumId = null;
    console.log("Album ID: ", body);

    if (body.album) {
        // check valid mongoose id
        if (!mongoose.Types.ObjectId.isValid(body.album)) {
            throw new Error("Invalid album id");
        }

        // check album exists
        const albumExists = await albumModel.findById(body.album);

        if (!albumExists) {
            throw new Error("Album not found");
        }

        // ownership validation
        if (albumExists.createdBy.toString() !== userId.toString()) {
            throw new Error("You are not allowed to upload into this album");
        }
        albumId = body.album;
    }

    // create image
    const newImage = await imageModel.create({
        url: result.secure_url,
        public_id: result.public_id,
        title: body.title,
        tags: body.tags ? body.tags.split(",").map(tag => tag.trim()) : [],
        uploadedBy: userId,
        album: body.album
    });
    const populatedImage = await imageModel.findById(newImage._id).populate('album');

    // if album exists then push image into album
    if (albumId) {
        await albumModel.findByIdAndUpdate(
            albumId,
            {
                $push: {
                    images: newImage._id
                }
            }
        );
    }

    // return newImage;

    
    return populatedImage;
};


const deleteImageService = async (id) => {

    const image = await imageModel.findById(id);

    if (!image) {
        return null;
    }

    if (image.public_id) {

        await cloudinary.uploader.destroy(image.public_id);

        console.log(`Deleted image from Cloudinary: ${image.public_id}`);
    }

    if (!image.public_id) {

        console.log(`Not Deleted image from Cloudinary: ${image.public_id}`);
    }

    await image.deleteOne();

    return image;
};

const getAllImagesService = async () => {

    const images = await imageModel.find().populate('uploadedBy').populate('album');

    return images;
};

const getImageByIdService = async (id) => {
    const image = await imageModel.findById(id).populate('uploadedBy');
    return image;
};

const getImagesByUserIdService = async (userId) => {
    const images = await imageModel.find({ uploadedBy: userId }).populate('uploadedBy').populate('album');
    return images;
};


const updateImageService = async (id, body, file) => {
    const image = await imageModel.findById(id);
    if (!image) {
        return null;
    }

    if (body.title) {
        image.title = body.title;
    }

    if (body.tags) {
        image.tags = body.tags.split(",").map(tag => tag.trim());
    }

    if (file) {
        if (image.public_id) {
            await cloudinary.uploader.destroy(image.public_id);
        }

        const result = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "gallery_app",
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
        image.url = result.secure_url;
        image.public_id = result.public_id;
    }

    await image.save();
    return image;
};

module.exports = { uploadImageService, deleteImageService, getAllImagesService, getImageByIdService, getImagesByUserIdService, updateImageService };