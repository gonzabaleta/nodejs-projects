const { engine } = require("express-handlebars");
const express = require("express");
const router = require("./routers");
require("dotenv").config();
const mongoose = require("mongoose");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");
const { ProductsController } = require("./controllers/products.controller");
const { MessagesController } = require("./controllers/messages.controller");

// Initialize servers
const app = express(); // Initialize App
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

// Set up middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up Template Engines

app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.static(__dirname + "/public"));

// Connect MONGO ATLAS
const { MONGO_ATLAS_URL } = process.env;
const URL = MONGO_ATLAS_URL;
mongoose.connect(URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Set up routers
app.use("/", router);

// Initialize Server
const PORT = 3000;
const server = httpServer.listen(PORT, () =>
  console.log(`Escuchando puerto ${PORT}`)
);
server.on("error", (err) => res.send(`Error de servidor! ${err}`));

const productsController = new ProductsController();
const messagesController = new MessagesController();
const products = [];
const messages = [];

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");

  (async () => {
    try {
      products.splice(0, products.length);
      const getProducts = await productsController.returnProducts();
      products.push(...getProducts);
      socket.emit("products", products);

      messages.splice(0, messages.length);
      const getMessages = await messagesController.returnMessages();
      messages.push(...getMessages);
      socket.emit("messages", messages);
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  })();

  socket.on("new-product", (data) => {
    productsController.createProductFromSocket(data).then((productSave) => {
      products.push(productSave);
      io.sockets.emit("products", products);
    });
  });

  socket.on("new-message", (data) => {
    messagesController.createMessageFromSocket(data).then((messageSave) => {
      messages.push(messageSave);
      io.sockets.emit("messages", messages);
    });
  });
});
