const express = require("express");

const { Router } = express;

const app = express();
const router = Router();

app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

const { getDefaultProducts } = require("./getDefaultProducts.js");

const products = getDefaultProducts();

let prodID = products[products.length - 1].id;

router
  .route("/productos")

  // GET: Devuelve todos los productos
  .get((req, res) => res.json(products))

  // POST: Agrega un producto
  .post((req, res) => {
    const data = req.body;
    const id = ++prodID;

    const producto = { id, ...data };
    products.push(producto);

    res.json(producto);
  });

// Middleware para buscar el producto en las rutas con params
const findProduct = (req, res, next) => {
  const { id } = req.params;
  const productID = products.findIndex((prod) => prod.id === +id);

  if (productID === -1) {
    res.json({ error: "Producto no encontrado" });
  } else {
    res.locals.index = productID;
    next();
  }
};

router
  .route("/productos/:id")
  .all(findProduct)

  // GET: Devuelve un producto por ID
  .get((req, res) => {
    const { index } = res.locals;

    res.json(products[index]);
  })

  // PUT: Actualiza un producto por ID
  .put((req, res) => {
    const { index } = res.locals;
    const data = req.body;

    products[index] = { ...products[index], ...data };

    res.json(products[index]);
  })

  // DELETE: Elimina un producto por ID
  .delete((req, res) => {
    const { index } = res.locals;
    const product = products[index];
    products.splice(index, 1);

    res.json(product);
  });

app.use("/api", router);

const PORT = 3000;

const server = app.listen(PORT, () => console.log(`Escuchando puerto ${PORT}`));

server.on("error", (err) => res.send(`Error de servidor! ${err}`));
