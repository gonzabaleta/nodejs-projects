const mongoose = require("mongoose");

const productsCollection = "products";

const ProductsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
});

const model = mongoose.model(productsCollection, ProductsSchema);

module.exports = { model, ProductsSchema };
