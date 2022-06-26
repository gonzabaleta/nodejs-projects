const socket = io.connect();

function render(data) {
  const html = data
    .map((el, index) => {
      return `<div>
            <strong>${el.author}</strong>
            <em>${el.text}</em>
        </div>`;
    })
    .join("");
  document.getElementById("messages").innerHTML = html;
}

function addMessage(e) {
  const message = {
    author: document.getElementById("username").value,
    text: document.getElementById("texto").value,
  };
  socket.emit("new-message", message);
  return false;
}

socket.on("messages", (data) => {
  render(data);
});
