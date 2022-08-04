const mongoose = require("mongoose");

const collection = "messages";

const AuthorSchema = new mongoose.Schema({
  email: { type: String, required: true },
});

const MessagesSchema = new mongoose.Schema({
  author: { type: AuthorSchema, required: true },
  text: { type: String, required: true },
  date: { type: String, required: true },
});

const model = mongoose.model(collection, MessagesSchema);

module.exports = { model, MessagesSchema };
