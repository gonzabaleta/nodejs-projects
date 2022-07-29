const { FirebaseController } = require("../../controllers/firebase.controller");

class ProductsFirebaseController extends FirebaseController {
  constructor(collection) {
    super(collection);
  }

  getData = async (req, res) => {
    try {
      const querySnapshot = await this.query.get();
      const docs = querySnapshot.docs;

      const response = docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
        price: doc.data().price,
        stock: doc.data().stock,
      }));

      res.json(response);
    } catch (err) {
      res.json({ msg: `Error ${err.message}` });
    }
  };

  createProduct = async (req, res) => {
    const product = req.body;

    try {
      if (!product.title || !product.price || !product.stock) {
        throw new Error("Todos los campos son requeridos");
      } else {
        const doc = this.query.doc();

        await doc.create(product);
        res.json({ msg: "Producto creado exitosamente" });
      }
    } catch (err) {
      res.json({ msg: `Error ${err.message}` });
    }
  };

  getOneProduct = async (req, res) => {
    const { id } = req.params;

    try {
      const doc = this.query.doc(`${id}`);
      const item = await doc.get();

      if (item.length) {
        res.json({ id, ...item.data() });
      } else {
        res.json({ msg: "Producto no encontrado" });
      }
    } catch (err) {
      res.json({ msg: `Error ${err.message}` });
    }
  };

  deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
      const doc = this.query.doc(`${id}`);
      await doc.delete();
      res.json({ msg: "Producto eliminado exitosamente" });
    } catch (err) {
      res.json({ msg: `Error ${err.message}` });
    }
  };

  updateProduct = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
      const doc = this.query.doc(`${id}`);
      await doc.update(data);
      res.json({ msg: "Producto actualizado correctamente" });
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };
}

module.exports = { ProductsFirebaseController };
