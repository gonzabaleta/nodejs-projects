const { Router } = require("express");
const { ProductsController } = require("../controllers/products.controller");

const router = Router();
const productsController = new ProductsController();

router.route("/").get((req, res) => res.render("index"));
router
  .route("/productos")
  .get((req, res) => res.render("products"), { products });

module.exports = router;
