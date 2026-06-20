const { z } = require('zod');


const uploadImageSchema = z.object({
    // image: z.instanceof(Buffer, "Image file is required"),
    title: z.string().min(3, "Title must be at least 3 characters"),
    tags: z.string().optional(),
    // album: z.string().optional()
    album: z.preprocess(
        (val) => Array.isArray(val) ? val[0] : val,
        z.string().regex(/^[0-9a-fA-F]{24}$/).optional()
    )
});

const updateImageSchema = z.object({
    // image: z.instanceof(Buffer, "Image file must be a valid image").optional(),
    image: z.any().optional(),
    title: z.string().min(3, "Title must be at least 3 characters").optional(),
    tags: z.string().optional(),
    // album: z.string().optional()
    // album: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid album id").optional()
});

const imageIdSchema = z.object({
    id: z.string().length(24, "Invalid MongoDB ID")
});

const userIdSchema = z.object({
    userId: z.string()
});
module.exports = { uploadImageSchema, updateImageSchema, imageIdSchema, userIdSchema };