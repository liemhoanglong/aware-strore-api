var mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    title: {
        type: String,
        default: ""
    },
    content: {
        type: String,
        default: ""
    },
    star: {
        type: Number,
        default: 5
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    color: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "color"
    },
    size: {
        type: String,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order"
    },
    postedDate: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('comment', commentSchema, 'comment');