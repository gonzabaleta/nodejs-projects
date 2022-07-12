const fs = require("fs");
const express = require("express"); // Require Express
const { Router } = express; // Initialize Router class

const { Server: HttpServer } = require("http");

// Initialize servers
const app = express(); // Initialize App
const httpServer = new HttpServer(app);

const api = Router(); // Initialize API Router
const static = Router(); // Initialize Static Router

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize products
// const { getDefaultProducts } = require("./getDefaultProducts.js");
const PATH_PRODUCTS = "./productos.txt";
const products = JSON.parse(fs.readFileSync(PATH_PRODUCTS, "utf-8"));
console.log(products);

let prodID = products[products.length - 1]?.id || 0; // Inicializar el ID con el ID del último producto si existe, si no inicializar en 0

// fs.writeFileSync(PATH_PRODUCTS, JSON.stringify(products));

// Initialize carts
const PATH_CARTS = "./carts.txt";
// const { getDefaultCarts } = require("./getDefaultCarts");
const carts = JSON.parse(fs.readFileSync(PATH_PRODUCTS, "utf-8"));

let cartID = carts[carts.length - 1]?.id || 0;

// fs.writeFileSync(PATH_CARTS, JSON.stringify(carts));

const persistProducts = (prods) =>
  fs.writeFileSync(PATH_PRODUCTS, JSON.stringify(prods));
const persistCarts = (updatedCarts) =>
  fs.writeFileSync(PATH_CARTS, JSON.stringify(updatedCarts));

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

/* ----------- 
  PRODUCTOS 
----------- */
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

    persistProducts(products);

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

    persistProducts(products);

    res.json(products[index]);
  })

  // DELETE: Elimina un producto por ID
  .delete((req, res) => {
    const { index } = res.locals;
    const product = products[index];
    products.splice(index, 1);

    persistProducts(products);

    res.json(product);
  });

/* ----------- 
  CARRITOS
----------- */
api
  // /CARRITO
  .route("/carrito")
  // POST: Crea un carrito
  .post((req, res) => {
    const data = req.body;
    const id = ++cartID;

    const timestamp = new Date().getTime();

    const cart = { id, timestamp, ...data };
    carts.push(cart);

    persistCarts(carts);

    res.json(id);
  });

// Middleware para buscar el carrito en las rutas con params
const findCart = (req, res, next) => {
  const { id } = req.params;
  const cartID = carts.findIndex((cart) => cart.id === +id);

  if (cartID === -1) {
    res.json({ error: "Producto no encontrado" });
  } else {
    res.locals.index = cartID;
    next();
  }
};

// /CARRITO/ID;
api
  .route("/carrito/:id")
  .all(findCart)

  // DELETE: elimina el carrito
  .delete((req, res) => {
    const { index } = res.locals;
    const cart = carts[index];
    carts.splice(index, 1);

    persistCarts(carts);

    res.json(cart);
  });

// /CARRITO/ID/PRODUCTOS
api
  .route("/carrito/:id/productos")
  .all(findCart)

  // GET: Devuelve los productos del carrito;
  .get((req, res) => {
    const { index } = res.locals;
    const cart = carts[index];

    const cartProducts = cart.products;
    console.log(cartProducts);

    res.json(cartProducts);
  })

  // POST: agrega productos al carrito
  .post((req, res) => {
    const { index } = res.locals;
    const cart = carts[index];
    const { id } = req.body;

    // Verificamos si el producto ya existe en el carrito
    const cartProduct = cart.products.find((prod) => prod.id === +id);

    // Si existe, aumentamos la cantidad
    if (cartProduct) {
      cartProduct.quantity++;
    }
    // Si no existe, lo agregamos
    else {
      const timestamp = new Date().getTime();
      const product = products.find((prod) => prod.id === +id);
      cart.products.push({ ...product, quantity: 1, timestamp });
    }

    persistCarts(carts);
    res.json(carts);
  });

// /CARRITO/ID/PRODUCTOS/ID_PROD

api
  .route("/carrito/:id/productos/:id_prod")
  .all(findCart)

  // DELETE: elimina un producto del carrito por ID
  .delete((req, res) => {
    const { index } = res.locals;
    const cart = carts[index];
    const productID = req.params.id_prod;

    console.log(productID);

    const productIndex = cart.products.findIndex(
      (prod) => prod.id === +productID
    );

    if (productIndex === -1) {
      res.send("El producto no existe en el carrito");
    } else {
      cart.products.splice(productIndex, 1);
      console.log(carts);
      res.send(carts);
      persistCarts(carts);
    }
  });

// Set up routers
app.use("/api", api);

// Initialize Server
const PORT = 3000;
const server = httpServer.listen(PORT, () =>
  console.log(`Escuchando puerto ${PORT}`)
);
server.on("error", (err) => res.send(`Error de servidor! ${err}`));
