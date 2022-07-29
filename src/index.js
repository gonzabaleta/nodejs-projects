const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());

const productsRouter = require("./routes/products.routes");
const cartsRouter = require("./routes/carts.routes");

app.use("/api/productos", productsRouter);
app.use("/api/carritos", cartsRouter);

const PORT = 3001;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
