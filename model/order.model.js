var mongoose = require('mongoose');

const genreSchema = mongoose.Schema(
    {
        name: String
    }
);

module.exports = mongoose.model('Genre', genreSchema, 'Genre');