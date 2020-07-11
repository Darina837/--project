const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    status: String,
    totalSum: Number,
    _idConsultant: String,
    _idUser: String,
    _idGood: [String],
    prices: [Number]
});

module.exports = mongoose.model('Order', orderSchema);