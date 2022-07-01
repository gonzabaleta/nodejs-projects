const express = require("express");
const { Server: HttpServer } = require("http");
const { Server: IOServer } = require("socket.io");

const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.static("public"));

const mensajes = [
  {
    author: "Juan",
    text: "Hola! Que tal?",
  },
  {
    author: "Pedro",
    text: "Muy bien! y vos?",
  },
  {
    author: "Ana",
    text: "Genial",
  },
];

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, function () {
  console.log(`Escuchando en puerto ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("Un cliente se ha conectado");
  socket.emit("messages", mensajes);

  socket.on("new-message", (data) => {
    mensajes.push(data);
    io.sockets.emit("messages", mensajes);
  });
});
