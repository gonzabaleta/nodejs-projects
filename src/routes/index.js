const { Router } = require("express");

const productsRouter = require("./products.routes");
const cartsRouter = require("./carts.routes");

const router = Router();

router.use("/productos", productsRouter);
router.use("/carritos", cartsRouter);

module.exports = router;
