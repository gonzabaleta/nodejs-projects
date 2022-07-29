const mongoose = require("mongoose");
const { ProductsSchema } = require("../models/products.model");

const cartsCollection = "carts";

const CartsSchema = new mongoose.Schema({
  products: [ProductsSchema],
});

const model = mongoose.model(cartsCollection, CartsSchema);

module.exports = { model, CartsSchema };
