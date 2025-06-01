const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    content: String,
    files: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File'
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    authorName: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
}, { versionKey: false });

module.exports = mongoose.model('Journal', journalSchema);