const { model } = require("../../models/products.model");
const { MongoController } = require("../../controllers/mongo.controller");

class ProductsMongoController extends MongoController {
  constructor() {
    super();
  }

  getData = async (req, res) => {
    try {
      const products = await model.find({});
      res.json(products);
    } catch (err) {
      throw new Error(`Error: ${err.message}`);
    }
  };

  createProduct = async (req, res) => {
    const product = req.body;
    console.log(product);
    try {
      if (!product.title || !product.price || !product.stock) {
        throw new Error("Todos los campos son requeridos");
      } else {
        const productSaveModel = new model(product);
        await productSaveModel.save();
        res.json({ msg: "Producto agregado con éxito" });
      }
    } catch (err) {
      throw new Error(`Error: ${err.message}`);
    }
  };

  getOneProduct = async (req, res) => {
    const { id } = req.params;

    try {
      const product = await model.find({ _id: id });
      if (product.length) {
        res.json(product);
      } else {
        res.json({ msg: "Producto no encontrado" });
      }
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };

  deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
      await model.deleteOne({ _id: id });
      res.json({ msg: "Producto eliminado exitosamente" });
    } catch (err) {
      res.json({ msg: `Error ${err.message}` });
    }
  };

  updateProduct = async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    try {
      await model.updateOne({ _id: id }, data);
      res.json({ msg: "Producto actualizado correctamente" });
    } catch (err) {
      res.json({ msg: `Error: ${err.message}` });
    }
  };
}

module.exports = { ProductsMongoController };