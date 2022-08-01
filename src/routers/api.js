const { Router } = require("express");
const { ProductsController } = require("../controllers/products.controller");

const router = Router();
const productsController = new ProductsController();

router
  .route("/productos")
  .get(productsController.getData)
  .post(productsController.createProduct);

router
  .route("/productos/:id")
  .get(productsController.getOneProduct)
  .put(productsController.updateProduct)
  .delete(productsController.updateProduct);

module.exports = router;
