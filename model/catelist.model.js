const mongoose = require('mongoose');

const catelistSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = mongoose.model('catelist', catelistSchema, 'catelist');