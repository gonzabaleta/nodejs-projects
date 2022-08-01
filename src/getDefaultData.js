const getDefaultMessages = () => [
  {
    id: 1,
    email: "pedro@gmail.com",
    message: "Hola!",
    date: new Date("31 December 2021 12:26:47"),
  },
  {
    id: 2,
    email: "lucia@hotmail.com",
    message: "que tal",
    date: new Date("31 December 2021 12:28:00"),
  },
  {
    id: 3,
    email: "diego@outlook.com",
    message: "Cómo están todos?",
    date: new Date("31 December 2021 12:28:40"),
  },
];

const getDefaultProducts = () => [
  {
    id: 1,
    title: "Fideos",
    price: 80,
  },
  {
    id: 2,
    title: "Arroz",
    price: 100,
  },
  {
    id: 3,
    title: "Queso",
    price: 300,
  },
];

module.exports = { getDefaultMessages, getDefaultProducts };
