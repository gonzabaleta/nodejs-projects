const { MemoryController } = require("../../controllers/memory.controller");

class CartsMemoryContainer extends MemoryController {
  constructor(path) {
    super(path);

    // Cargamos carritos por default
    this.data = [
      {
        id: 1,
        products: [
          {
            id: 1,
            title: "Fideos",
            price: 80,
            stock: 150,
            quantity: 2,
          },
        ],
      },
      {
        id: 2,
        timestamp: 1657587750069,
        products: [
          {
            id: 3,
            title: "Queso",
            price: 300,
            stock: 893,
            quantity: 5,
          },
          {
            id: 1,
            title: "Fideos",
            price: 80,
            stock: 150,
            quantity: 1,
          },
        ],
      },
    ];
  }

  // Helper para encontrar un producto por ID
  findCart = (id) => {
    const index = this.data.findIndex((cart) => cart.id === +id);

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

      const cart = {
        id: this.data.at(-1).id + 1, // El ID es igual al del último carrito agregado + 1
        products,
      };
      this.data.push(cart);

      res.json({ msg: `Carrito N ${cart.id} creado con éxito` });
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };

  // GET carrito por ID
  getOneCart = async (req, res) => {
    const { id } = req.params;

    try {
      const cartIndex = this.findCart(id);

      if (cartIndex === null) {
        res.json({ msg: "Carrito no encontrado" });
      } else {
        res.json(this.data[cartIndex]);
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
      const cartIndex = this.findCart(id);

      if (cartIndex === null) {
        res.json({ msg: "Carrito no encontrado" });
      } else {
        this.data[cartIndex] = { ...this.data[cartIndex], ...data };
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
      const cartIndex = this.findCart(id);

      if (cartIndex === null) {
        res.json({ msg: "Carrito no encontrado" });
      } else {
        this.data.splice(cartIndex, 1);
        res.json({ msg: "Carrito eliminado correctamente" });
      }
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };
}

module.exports = { CartsMemoryContainer };
