const { FirebaseController } = require("../../controllers/firebase.controller");
const { ProductsFirebaseController } = require("../products/products.firebase");

class CartsFirebaseController extends FirebaseController {
  constructor(collection) {
    super(collection);
  }

  getData = async (req, res) => {
    try {
      const querySnapshot = await this.query.get();
      const docs = querySnapshot.docs;

      const response = docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      res.json(response);
    } catch (err) {
      res.json({ msg: `Error ${err.message}` });
    }
  };

  createCart = async (req, res) => {
    const cart = req.body;

    try {
      if (!cart.products.length) {
        throw new Error("Todos los campos son requeridos");
      } else {
        const doc = this.query.doc();

        await doc.create(cart);
        res.json({ msg: "Carrito creado correctamente" });
      }
    } catch (err) {
      res.json({ msg: `Error ${err.message}` });
    }
  };

  getOneCart = async (req, res) => {
    const { id } = req.params;

    try {
      const doc = this.query.doc(`${id}`);
      const item = await doc.get();

      if (item) {
        res.json({ id, ...item.data() });
      } else {
        res.json({ msg: "Carrito no encontrado" });
      }
    } catch (err) {
      res.json({ msg: `Error ${err.message}` });
    }
  };

  deleteCart = async (req, res) => {
    const { id } = req.params;

    try {
      const doc = this.query.doc(`${id}`);
      await doc.delete();
      res.json({ msg: "Carrito eliminado exitosamente" });
    } catch (err) {
      res.json({ msg: `Error ${err.message}` });
    }
  };

  updateCart = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
      const doc = this.query.doc(`${id}`);
      await doc.update(data);
      res.json({ msg: "Carrito actualizado correctamente" });
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };
}

module.exports = { CartsFirebaseController };
