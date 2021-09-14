const mongoose = require('mongoose');

const cateSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    belongCategroup: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "categroup",
    }],
    belongCatelist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "catelist",
    }],
});

module.exports = mongoose.model('cate', cateSchema, 'cate');