class MemoryController {
  constructor() {
    this.data = [];
  }

  getData = (req, res) => {
    res.json(this.data);
  };
}

module.exports = { MemoryController };
