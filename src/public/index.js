const socket = io.connect();

const renderProducts = (data) => {
  const html = data
    .map(
      (prod, index) =>
        `<div class="product-row"><h2>${prod.title}</h2><p>Precio: ${prod.price}</p></div>`
    )
    .join("");

  document.getElementById("products").innerHTML = html;
};

const renderMessages = (data) => {
  const html = data
    .map((message, index) => {
      const date = new Date(message.date);

      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const seconds = date.getSeconds();

      const dateString = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;

      return `<div class="message-row"><span class="email">${message.author.email}</span><span class="date">[${dateString}]</span>: <span class="message-text">${message.text}</span></div>`;
    })
    .join("");

  document.getElementById("messages-container").innerHTML = html;
};

socket.on("products", (data) => {
  renderProducts(data);
  console.log(data);
});

socket.on("messages", (data) => {
  console.log(data);
  renderMessages(data);
});

document.getElementById("form-main").addEventListener("submit", function (e) {
  e.preventDefault();
  const title = document.getElementById("product-title").value;
  const price = document.getElementById("product-price").value;
  const product = { title, price };
  socket.emit("new-product", product);
});

document
  .getElementById("send-message")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("user-email").value;
    const text = document.getElementById("user-message").value;
    const date = new Date();

    const message = { author: { email }, text, date };

    socket.emit("new-message", message);
  });
