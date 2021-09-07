var mongoose = require('mongoose');

const SIZE = ['S', 'M', 'L'];
const STATUS = ['-1', '0', '1']; //-1: Cancel, 0: Pending, 1: Completed
const orderSchema = mongoose.Schema({
    userId: String,
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product"
        },
        size: {
            type: String,
            enum: SIZE
        },
        quantity: Number
    }],
    feeShipping: Number,
    totalQuantity: Number,
    totalPrice: Number,
    name: String,
    phone: String,
    status: String,
    address: String,
    status: {
        type: Number,
        enum: STATUS
    },
    payment: String,
    orderedDate: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('order', orderSchema, 'order');