const { ProductsFsContainer } = require("../daos/products/products.fs");
const { ProductsMemoryContainer } = require("../daos/products/products.memory");
const { ProductsMongoController } = require("../daos/products/products.mongo");
const { Router } = require("express");
const router = Router();
const mongoose = require("mongoose");

const { PERSIST_METHOD, MONGO_ATLAS_URL } = process.env;

let productsContainer;

switch (PERSIST_METHOD) {
  case "fs":
    const PATH = __dirname + "/../products.json";
    productsContainer = new ProductsFsContainer(PATH);
    break;
  case "memory":
    productsContainer = new ProductsMemoryContainer();
    break;

  case "mongo":
    productsContainer = new ProductsMongoController();
    break;
  default:
    throw new Error(
      "Por favor indica un método de persistencia desde las variables de entorno"
    );
}

router.get("/", productsContainer.getData);
router.post("/", productsContainer.createProduct);

router.get("/:id", productsContainer.getOneProduct);
router.delete("/:id", productsContainer.deleteProduct);
router.put("/:id", productsContainer.updateProduct);

module.exports = router;
