var mongoose = require('mongoose');

// const SIZE = ['S', 'M', 'L'];
const STATUS = [-1, 0, 1, 2]; //-1: Cancel, 0: Pending, 1: Completed, 2: Delivering
const orderSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        size: {
            type: String,
            // enum: SIZE
        },
        quantity: Number,
        price: Number,
        color: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "color"
        },
        isReview: {
            type: Boolean,
            default: false
        },
    }],
    feeShipping: Number,
    totalPrice: Number,
    phone: String,
    address: String,
    note: {
        type: String,
        default: ''
    },
    status: {
        type: Number,
        enum: STATUS,
        default: 0
    },
    payment: {
        type: String,
        default: ''
    },
    orderedDate: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('order', orderSchema, 'order');