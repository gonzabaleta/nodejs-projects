// Get random int helper
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const numbers = {};

process.on("message", (amount) => {
  for (let i = 0; i < amount; i++) {
    const int = getRandomInt(1, 1000);
    if (numbers[int] >= 0) {
      numbers[int]++;
    } else {
      numbers[int] = 0;
    }
  }

  process.send(numbers);
});
