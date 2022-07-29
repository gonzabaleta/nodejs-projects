const { MemoryController } = require("../../controllers/memory.controller");

class ProductsMemoryContainer extends MemoryController {
  constructor(path) {
    super(path);

    // Cargamos data por default
    this.data = [
      { id: 1, title: "Fideos", price: 80, stock: 450 },
      { id: 2, title: "Arroz", price: 100, stock: 483 },
      { id: 3, title: "Queso", price: 300, stock: 893 },
      { id: 4, title: "Producto prueba", price: 3939, stock: 15 },
      { id: 5, title: "Producto prueba 2", price: 3939, stock: 15 },
    ];
  }

  // Helper para encontrar un producto por ID
  findProduct = (id) => {
    const index = this.data.findIndex((prod) => prod.id === +id);

    if (index === -1) {
      return null;
    } else {
      return index;
    }
  };

  // POST: Crear producto
  createProduct = async (req, res) => {
    const { title, price, stock } = req.body;

    try {
      // Validamos que haya nombre, precio y stock
      if (!title || !price || !stock) {
        throw new Error("Todos los campos son requeridos");
      }

      const product = {
        id: this.data.at(-1).id + 1, // El ID es igual al del último producto agregado + 1
        title,
        price,
        stock,
      };
      this.data.push(product);

      res.json({ msg: `Producto ${title} creado con éxito` });
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };

  getOneProduct = async (req, res) => {
    const { id } = req.params;

    try {
      const productIndex = this.findProduct(id);

      if (productIndex === null) {
        res.json({ msg: "Producto no encontrado" });
      } else {
        res.json(this.data[productIndex]);
      }
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };

  // UPDATE product por ID
  updateProduct = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
      const productIndex = this.findProduct(id);

      if (productIndex === null) {
        res.json({ msg: "Producto no encontrado" });
      } else {
        this.data[productIndex] = { ...this.data[productIndex], ...data };
        res.json({ msg: "Producto actualizado correctamente" });
      }
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };

  // DELETE producto por ID
  deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
      const productIndex = this.findProduct(id);

      if (productIndex === null) {
        res.json({ msg: "Producto no encontrado" });
      } else {
        this.data.splice(productIndex, 1);
        res.json({ msg: "Producto eliminado correctamente" });
      }
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };
}

module.exports = { ProductsMemoryContainer };
