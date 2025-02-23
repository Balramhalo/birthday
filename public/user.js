const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    uniqueId: { type: Number, unique: true },
    isAdmin: { type: Boolean, default: false },
    translationHistory: { type: Array, default: [] }
});

module.exports = mongoose.model('User ', userSchema);