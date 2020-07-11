const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const managerSchema = new Schema({
    login: String,
    password: String
});

module.exports = mongoose.model('Manager', managerSchema);