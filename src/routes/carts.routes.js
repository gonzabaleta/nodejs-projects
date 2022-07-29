const { CartsFsContainer } = require("../daos/carts/carts.fs");
const { CartsMemoryContainer } = require("../daos/carts/carts.memory");
const { CartsMongoController } = require("../daos/carts/carts.mongo");
const { Router } = require("express");
const router = Router();

let cartsContainer;
const { PERSIST_METHOD } = process.env;

switch (PERSIST_METHOD) {
  case "fs":
    const PATH = __dirname + "/../carts.json";
    cartsContainer = new CartsFsContainer(PATH);
    break;
  case "memory":
    cartsContainer = new CartsMemoryContainer();
    break;
  case "mongo":
    cartsContainer = new CartsMongoController();
    break;
  default:
    throw new Error(
      "Por favor indica un método de persistencia desde las variables de entorno"
    );
}

router.get("/", cartsContainer.getData);
router.post("/", cartsContainer.createCart);

router.get("/:id", cartsContainer.getOneCart);
router.delete("/:id", cartsContainer.deleteCart);
router.put("/:id", cartsContainer.updateCart);

module.exports = router;
