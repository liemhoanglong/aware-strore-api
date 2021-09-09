const mongoose = require('mongoose');

const categroupSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    belongCatelist: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "catelist"
    }],

});

module.exports = mongoose.model('categroup', categroupSchema, 'categroup');