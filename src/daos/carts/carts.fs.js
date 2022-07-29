const { FileSystemContainer } = require("../../controllers/fs.controller");

class CartsFsContainer extends FileSystemContainer {
  constructor(path) {
    super(path);
  }

  // Helper para encontrar un producto por ID
  findCart = (carts, id) => {
    const index = carts.findIndex((cart) => cart.id === +id);

    if (index === -1) {
      return null;
    } else {
      return index;
    }
  };

  // POST: Crear carrito
  createCart = async (req, res) => {
    const { products } = req.body;

    try {
      // Validamos que haya productos
      if (!products) {
        throw new Error("Todos los campos son requeridos");
      }

      const carts = await this.parseData();

      const cart = {
        id: carts.at(-1).id + 1, // El ID es igual al del último carrito agregado + 1
        products,
      };
      carts.push(cart);
      await this.persistData(cart);

      res.json({ msg: `Carrito N ${cart.id} creado con éxito` });
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };

  // GET carrito por ID
  getOneCart = async (req, res) => {
    const { id } = req.params;

    try {
      const carts = await this.parseData();
      const cartIndex = this.findCart(carts, id);

      if (cartIndex === null) {
        res.json({ msg: "Carrito no encontrado" });
      } else {
        res.json(carts[cartIndex]);
      }
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };

  // UPDATE carrito por ID
  updateCart = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
      const carts = await this.parseData();
      const cartIndex = this.findCart(carts, id);
      carts[cartIndex] = { ...carts[cartIndex], ...data };

      if (cartIndex === null) {
        res.json({ msg: "Carrito no encontrado" });
      } else {
        await this.persistData(carts);
        res.json({ msg: "Producto actualizado correctamente" });
      }
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };

  // DELETE carrito por ID
  deleteCart = async (req, res) => {
    const { id } = req.params;

    try {
      const carts = await this.parseData();
      const cartIndex = this.findCart(carts, id);

      if (cartIndex === null) {
        res.json({ msg: "Carrito no encontrado" });
      } else {
        carts.splice(cartIndex, 1);
        await this.persistData(carts);
        res.json({ msg: "Carrito eliminado correctamente" });
      }
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };
}

module.exports = { CartsFsContainer };
