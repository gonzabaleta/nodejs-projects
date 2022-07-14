const { engine } = require("express-handlebars"); // Require Handlebars
const express = require("express"); // Require Express
const { Router } = express; // Initialize Router class

const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

// Initialize servers
const app = express(); // Initialize App
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

const api = Router(); // Initialize API Router
const static = Router(); // Initialize Static Router

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Template Engines
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));

// DATABASE
const { options_mariaDB } = require("./options/mariaDB.js");
const { options_sqlite3 } = require("./options/sqlite3.js");
const { ProductsDBContainer } = require("./containers/products");
const { MessagesDBContainer } = require("./containers/messages");

const messagesDB = new MessagesDBContainer(options_sqlite3, "messages");
const productsDB = new ProductsDBContainer(options_mariaDB, "products");

// Initialize products
const products = [];

(async () => {
  const newProducts = await productsDB.getAllProducts();

  products.push(...newProducts);
})();

/***************************************
 RUN TO LOAD DEFAULT PRODUCTS TO DATABASE
 
 productsDB.createTable();
 const { getDefaultProducts } = require("./getDefaultProducts.js");
 const products = getDefaultProducts();
 
 productsDB.saveProducts(products);
 
 ***************************************/

let prodID = products[products.length - 1]?.id || 0;

//  Initialize messages
const messages = [];

(async () => {
  const newMessages = await messagesDB.getAllMessages();

  messages.push(...newMessages);
})();

/****************************************
 RUN TO LOAD DEFAULT MESSAGES TO DATABASE 
 
messagesDB.createTable();
const { getDefaultMessages } = require("./getDefaultMessages");
const messages = getDefaultMessages();

messagesDB.saveMessages(messages);

*****************************************/

let messageID = messages[messages.length - 1]?.id || 0;

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
const server = httpServer.listen(PORT, () =>
  console.log(`Escuchando puerto ${PORT}`)
);
server.on("error", (err) => res.send(`Error de servidor! ${err}`));

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  socket.emit("products", products);
  socket.emit("messages", messages);

  socket.on("new-product", (data) => {
    products.push({ ...data, id: ++prodID });
    productsDB.saveProducts(data);
    io.sockets.emit("products", products);
  });

  socket.on("new-message", (data) => {
    messages.push({ ...data, id: ++messageID });
    messagesDB.saveMessages(data);
    io.sockets.emit("messages", messages);
  });
});
