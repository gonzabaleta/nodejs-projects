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

module.exports = { getDefaultMessages };
