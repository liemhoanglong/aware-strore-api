const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        default: ""
    },
    isLocalLogin: {
        type: Boolean,
        default: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    registerDate: {
        type: Date,
        default: Date.now()
    },
    avatar: {
        type: String,
        default: ""
    },
});

module.exports = mongoose.model('user', usersSchema, 'user');