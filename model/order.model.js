var mongoose = require('mongoose');

const SIZE = ['S', 'M', 'L'];
const STATUS = [-1, 0, 1]; //-1: Cancel, 0: Pending, 1: Completed
const orderSchema = mongoose.Schema({
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
            enum: SIZE
        },
        quantity: Number,
        color: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "color"
        }
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