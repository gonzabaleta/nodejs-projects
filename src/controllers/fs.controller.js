const fs = require("fs").promises;

class FileSystemContainer {
  constructor(path) {
    this.path = path;
  }

  persistData = async (data) => {
    await fs.writeFile(this.path, JSON.stringify(data));
  };

  getData = async (req, res) => {
    try {
      const rawData = await fs.readFile(this.path, "utf-8");
      const data = JSON.parse(rawData);
      res.json(data);
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };

  parseData = async () => {
    try {
      const rawData = await fs.readFile(this.path, "utf-8");
      return JSON.parse(rawData);
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };
}

module.exports = { FileSystemContainer };
