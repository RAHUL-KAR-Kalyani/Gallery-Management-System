const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const albumSchema = new Schema({
    name: {
        type: String,
        // required: true,
        trim: true
    },
    description: {
        type: String,
        default: ""
    },
    coverImage: {
        type: String,
        default: ""
    },
    images: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Image"
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    // visibility: {
    //     type: String,
    //     enum: ['public', 'private', 'shared'],
    //     default: 'public'
    // },
    shareToken: {
        type: String,
        default: null
    }
}, { timestamps: true });

const albumModel = mongoose.model('Album', albumSchema);
module.exports = albumModel;