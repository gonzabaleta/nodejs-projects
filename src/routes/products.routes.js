const { ProductsFsContainer } = require("../daos/products/products.fs");
const { ProductsMemoryContainer } = require("../daos/products/products.memory");
const { Router } = require("express");
const router = Router();

const { PERSIST_METHOD } = process.env;

let productsContainer;

switch (PERSIST_METHOD) {
  case "fs":
    const PATH = __dirname + "/../products.json";
    productsContainer = new ProductsFsContainer(PATH);
    break;
  case "memory":
    productsContainer = new ProductsMemoryContainer();
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
