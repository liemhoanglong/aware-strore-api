var mongoose = require('mongoose');

const genreSchema = mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },
    postedDate: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('Genre', genreSchema, 'Genre');