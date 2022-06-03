const express = require("express");

const contenedor = require("./container");

const app = express();

app.get("/products", async (req, res) => {
  const products = await contenedor.getAll();
  res.send(products);
});

app.get("/productoRandom", async (req, res) => {
  const products = await contenedor.getAll();
  const min = 0;
  const max = products.length - 1;
  const index = Math.floor(Math.random() * (max - min + 1) + min);
  const selectedProduct = products[index];
  res.send(selectedProduct);
});

const PORT = process.env.port || 8080;

const server = app.listen(PORT, () => console.log("escuchando puerto " + 8080));
