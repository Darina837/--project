const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const goodSchema = new Schema({
    name: String,
    price: Number,
    metal: String,
    insertion: String,
    campaign: String,
    theme: String,
    country: String,
    _idCategory: String,
    size: [String]
});

module.exports = mongoose.model('Good', goodSchema);