const { model } = require("../../models/carts.models");
const { MongoController } = require("../../controllers/mongo.controller");

class CartsMongoController extends MongoController {
  constructor() {
    super();
  }

  getData = async (req, res) => {
    try {
      const carts = await model.find({});
      res.json(carts);
    } catch (err) {
      throw new Error(`Error: ${err.message}`);
    }
  };

  createCart = async (req, res) => {
    const { products } = req.body;

    try {
      if (!products || !products.length) {
        throw new Error("Todos los campos son requeridos");
      }

      const cart = {
        products,
      };

      const cartSaveModel = new model(cart);
      await cartSaveModel.save();
      res.json({ msg: "Carrito creado correctamente" });
    } catch (err) {
      res.json({ msg: `Error ${err.message}` });
    }
  };

  getOneCart = async (req, res) => {
    const { id } = req.params;

    try {
      const cart = await model.find({ _id: id });

      if (cart.length) {
        res.json(cart);
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
      await model.deleteOne({ _id: id });
      res.json({ msg: "Carrito eliminado existosamente" });
    } catch (err) {
      res.json({ msg: `Error ${err.message}` });
    }
  };

  updateCart = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
      await model.updateOne({ _id: id }, data);
      res.json({ msg: "Carrito actualizado existosamente" });
    } catch (err) {
      res.json({ msg: `Error ${err.message}` });
    }
  };
}

module.exports = { CartsMongoController };
