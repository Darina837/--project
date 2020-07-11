const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const consultantSchema = new Schema({
    login: String,
    password: String
});

module.exports = mongoose.model('Consultant', consultantSchema);