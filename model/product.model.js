var mongoose = require('mongoose');

const SIZE = ['S', 'M', 'L'];
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    size: [{
        name: {
            type: String,
            enum: SIZE
        },
        quantity: {
            type: Number,
            default: 0
        },
        info: {
            type: String,
            default: ''
        }
    }],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand"
    },
    imageList: [{
        type: String
    }],
    colors: [{
        type: mongoose.Types.ObjectId,
        ref: "color"
    }],
    catelist: [{
        type: mongoose.Types.ObjectId,
        ref: "catelist"
    }],
    categroup: [{
        type: mongoose.Types.ObjectId,
        ref: "categroup"
    }],
    cate: [{
        type: mongoose.Types.ObjectId,
        ref: "cate"
    }],
    status: { // 1 available, 0 empty
        type: Number,
        default: 1,
    },
    isDelete: { // 1 delete
        type: Number,
        default: 0,
    },
    postedDate: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('product', productSchema, 'product');