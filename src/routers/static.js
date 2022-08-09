const { Router } = require("express");
const { model } = require("../models/products.model");
const router = Router();

(async () => {
  const products = await model.find({});

  router.route("/").get((req, res) => {
    if (req.session.user) {
      res.render("index", { renderUser: true, user: req.session.user });
    } else {
      res.render("index", { renderUser: false });
    }
  });
  router
    .route("/login")
    .get((req, res) => res.render("login"))
    .post((req, res) => {
      const { name } = req.body;
      req.session.user = name;
      res.redirect("/");
    });

  router.route("/logout").get((req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.json({ msg: "ERROR de logout" });
      }

      res.redirect("/");
    });
  });

  router
    .route("/productos")
    .get((req, res) => res.render("productos", { products }));
})();

module.exports = router;
