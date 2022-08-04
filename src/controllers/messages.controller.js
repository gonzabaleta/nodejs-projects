const { model } = require("../models/messages.model");

class MessagesController {
  constructor() {
    this.messages = [];
  }

  getData = async (req, res) => {
    try {
      const messages = await model.find({});
      res.json(messages);
    } catch (err) {
      throw new Error(`Error: ${err.message}`);
    }
  };

  returnMessages = async () => {
    try {
      const messages = await model.find({});
      return messages;
    } catch (err) {
      throw new Error(`Error: ${err.message}`);
    }
  };

  createMessageFromSocket = async (message) => {
    try {
      if (!message.author || !message.text) {
        throw new Error("Todos los campos son requeridos");
      } else {
        const messageSaveModel = new model(message);
        const messageSave = await messageSaveModel.save();
        return messageSave;
      }
    } catch (err) {
      throw new Error(`Error: ${err.message}`);
    }
  };
}

module.exports = { MessagesController };
