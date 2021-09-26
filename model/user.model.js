const mongoose = require('mongoose');

// const SIZE = ['S', 'M', 'L'];
const usersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    name: {
        type: String,
        required: true,
        default: ""
    },
    password: {
        type: String,
        required: true,
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
    cart: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        size: {
            type: String,
            // enum: SIZE
        },
        quantity: Number,
        color: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "color"
        }
    }],
});

module.exports = mongoose.model('user', usersSchema, 'user');