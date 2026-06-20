const { z } = require("zod");


const createAlbumSchema = z.object({
    name: z.string().min(3, "Album name must be at least 3 characters"),
    description: z.string().optional(),
    images: z.array(z.string().length(24, "Invalid image ID")).optional()
});


// UPDATE ALBUM
const updateAlbumSchema = z.object({
    name: z.string().min(3, "Album name must be at least 3 characters").optional(),
    description: z.string().optional(),
    addImages: z.array(z.string().length(24, "Invalid image ID")).optional(),
    removeImages: z.array(z.string().length(24, "Invalid image ID")).optional()
});

const renameAlbumSchema = z.object({
    name: z.string().min(3, "Album name must be at least 3 characters")
});


// ALBUM ID PARAM
const albumIdSchema = z.object({
    id: z.string().length(24, "Invalid MongoDB ID")
});

const userIdSchema = z.object({
    userId: z.string()
});


module.exports = { createAlbumSchema, updateAlbumSchema, renameAlbumSchema, albumIdSchema, userIdSchema };