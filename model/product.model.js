var mongoose = require('mongoose');

const SIZE = ['S', 'M', 'L'];
const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    postedDate: {
        type: Date,
        default: Date.now()
    },
    size: [{
        name: {
            type: String,
            required: true,
            unique: true,
            enum: SIZE
        },
        quantity: {
            type: Number,
            default: 0
        },
        info: String
    }],
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brand"
    },
    imageList: {
        type: Array
    },
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
    rate: [{
        type: mongoose.Types.ObjectId,
        ref: "rate"
    }],
});

module.exports = mongoose.model('product', productSchema, 'product');