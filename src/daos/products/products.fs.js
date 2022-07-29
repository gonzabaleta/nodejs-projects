const { FileSystemContainer } = require("../../controllers/fs.controller");

class ProductsFsContainer extends FileSystemContainer {
  constructor(path) {
    super(path);
  }

  // Helper para encontrar un producto por ID
  findProduct = (products, id) => {
    const index = products.findIndex((prod) => prod.id === +id);

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

      const products = await this.parseData();

      const product = {
        id: products.at(-1).id + 1, // El ID es igual al del último producto agregado + 1
        title,
        price,
        stock,
      };
      products.push(product);
      await this.persistData(products);

      res.json({ msg: `Producto ${title} creado con éxito` });
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };

  getOneProduct = async (req, res) => {
    const { id } = req.params;

    try {
      const products = await this.parseData();
      const productIndex = this.findProduct(products, id);

      if (productIndex === null) {
        res.json({ msg: "Producto no encontrado" });
      } else {
        res.json(products[productIndex]);
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
      const products = await this.parseData();
      const productIndex = this.findProduct(products, id);

      if (productIndex === null) {
        res.json({ msg: "Producto no encontrado" });
      } else {
        products[productIndex] = { ...products[productIndex], ...data };
        await this.persistData(products);
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
      const products = await this.parseData();
      const productIndex = this.findProduct(products, id);

      if (productIndex === null) {
        res.json({ msg: "Producto no encontrado" });
      } else {
        products.splice(productIndex, 1);
        await this.persistData(products);
        res.json({ msg: "Producto eliminado correctamente" });
      }
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };
}

module.exports = { ProductsFsContainer };
