const mongoose = require('mongoose');

const colorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    code: String
});

module.exports = mongoose.model('color', colorSchema, 'color');