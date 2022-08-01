const { engine } = require("express-handlebars");
const express = require("express");
const router = require("./routers");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

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
app.set("views", "./views");
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
