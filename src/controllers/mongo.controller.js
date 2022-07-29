const mongoose = require("mongoose");

const { MONGO_ATLAS_URL } = process.env;

class MongoController {
  constructor() {}

  getData = () => null;
}

module.exports = { MongoController };
