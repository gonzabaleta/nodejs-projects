const express = require("express"); // Require Express
const { Router } = express; // Initialize Router class

const app = express(); // Initialize App
const api = Router(); // Initialize API Router
const static = Router(); // Initialize Static Router

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Template Engines
app.set("view engine", "ejs");
app.set("views", "./views");

// Initialize products
const { getDefaultProducts } = require("./getDefaultProducts.js");
const products = getDefaultProducts();
let prodID = products[products.length - 1]?.id || 0;

/**************
 * STATIC *
 **************/
static.route("/").get((req, res) => res.render("index"));

static
  .route("/productos")
  .get((req, res) => res.render("products", { products }));

/**************
 * API *
 **************/
// PRODUCTOS
api
  .route("/productos")

  // GET: Devuelve todos los productos
  .get((req, res) => res.json(products))

  // POST: Agrega un producto
  .post((req, res) => {
    const data = req.body;
    const id = ++prodID;

    const producto = { id, ...data };
    products.push(producto);

    res.redirect("/");
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

// PRODUCTOS/ID
api
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

// Set up routers
app.use("/api", api);
app.use("/", static);

// Initialize Server
const PORT = 3000;
const server = app.listen(PORT, () => console.log(`Escuchando puerto ${PORT}`));
server.on("error", (err) => res.send(`Error de servidor! ${err}`));
