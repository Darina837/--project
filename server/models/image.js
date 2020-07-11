const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    _idGood: String,
    text: String,
    url: String
});

module.exports = mongoose.model('Image', imageSchema);