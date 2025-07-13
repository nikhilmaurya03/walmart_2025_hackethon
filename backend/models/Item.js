const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stock: Number,
  expiry_date: Date,
  image: String,
});

module.exports = mongoose.model('Item', itemSchema, 'products');

