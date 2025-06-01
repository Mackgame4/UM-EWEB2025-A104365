const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: String,
    originalname: String,
    mimetype: String,
    date: Date,
    size: Number,
    path: String,
    journal: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Journal',
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, { versionKey: false });

module.exports = mongoose.model('File', fileSchema);