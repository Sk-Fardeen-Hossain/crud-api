const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    itemname: { type: String, required: true },
    details: { type: String, required: true }
}, { collection: 'items' });

module.exports = mongoose.model('Item', itemSchema);
