const { Router } = require("express");
const { model } = require("../models/products.model");
const router = Router();

(async () => {
  const products = await model.find({});

  router.route("/").get((req, res) => res.render("index"));
  router
    .route("/productos")
    .get((req, res) => res.render("productos", { products }));
})();

module.exports = router;
