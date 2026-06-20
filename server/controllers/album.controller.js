const e = require("express");
const { createAlbumService, getAlbumService, getAlbumByIdService, getAlbumByUserIdService, updateAlbumService, deleteAlbumService, renameAlbumService, sharableLinkService, getSharedAlbumService } = require("../services/albumService");
const crypto = require("crypto");
const albumModel = require("../models/albumModel");

const createAlbum = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "coverImage file is required"
            });
        }

        const album = await createAlbumService(req.body, req.file, req.user.id);
        return res.status(201).json({
            success: true,
            message: "Album created successfully",
            album
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getAlbum = async (req, res) => {
    try {
        const albums = await getAlbumService();
        return res.status(200).json({
            success: true,
            albums
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getAlbumById = async (req, res) => {
    try {

        const album = await getAlbumByIdService(req.params.id);

        if (!album) {
            return res.status(404).json({
                success: false,
                message: "Album not found"
            });
        }

        return res.status(200).json({
            success: true,
            album
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getAlbumByUserId = async (req, res) => {
    try {
        const albums = await getAlbumByUserIdService(req.params.userId);
        return res.status(200).json({
            success: true,
            albums
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
}

const updateAlbum = async (req, res) => {
    try {
        const album = await updateAlbumService(req.params.id, req.body, req.file);
        if (!album) {
            return res.status(404).json({
                success: false,
                message: "Album not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Album updated successfully",
            album
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const deleteAlbum = async (req, res) => {
    try {

        const album = await deleteAlbumService(req.params.id);
        if (!album) {
            return res.status(404).json({
                success: false,
                message: "Album not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Album deleted successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const renameAlbum = async (req, res) => {
    try {
        const album = await renameAlbumService(req.params.id, req.body.name);
        if (!album) {
            return res.status(404).json({
                success: false,
                message: "Album not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Album renamed successfully",
            album
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            error: err,
            success: false
        });
    }
}

const sharableLink = async (req, res) => {
    try {
        const link = await sharableLinkService(req.params.id);

        if (!link) {
            return res.status(404).json({
                success: false,
                message: "Album not found"
            });
        }

        return res.status(200).json({
            success: true,
            sharableLink: link
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

const getSharedAlbum = async (req, res) => {
    try {
        const album = await getSharedAlbumService(req.params.token);

        if (!album) {
            return res.status(404).json({
                success: false,
                message: "Album not found"
            });
        }

        return res.status(200).json({
            success: true,
            album
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Server Error",
            error: err,
            success: false
        });
    }
};

module.exports = { createAlbum, getAlbum, getAlbumById, getAlbumByUserId, updateAlbum, deleteAlbum, renameAlbum, sharableLink, getSharedAlbum };