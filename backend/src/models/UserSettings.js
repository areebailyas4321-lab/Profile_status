const mongoose = require('mongoose');

const userSettingsSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        enum: ['Online', 'Offline'],
        default: 'Offline'
    },
    theme: {
        type: String,
        enum: ['Light', 'Dark'],
        default: 'Light'
    }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model('UserSettings', userSettingsSchema);
