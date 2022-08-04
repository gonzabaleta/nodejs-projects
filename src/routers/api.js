const { Router } = require("express");
const { MessagesController } = require("../controllers/messages.controller");
const { ProductsController } = require("../controllers/products.controller");

const router = Router();
const productsController = new ProductsController();
const messagesController = new MessagesController();

router
  .route("/productos")
  .get(productsController.getData)
  .post(productsController.createProduct);

router
  .route("/productos/:id")
  .get(productsController.getOneProduct)
  .put(productsController.updateProduct)
  .delete(productsController.updateProduct);

router.route("/messages").get(messagesController.getData);

router.route("/productos-test").get(productsController.getFakeProducts);

module.exports = router;
