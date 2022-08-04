const { model } = require("../models/messages.model");
const { normalize, schema, denormalize } = require("normalizr");
const util = require("util");

const authorSchema = new schema.Entity("authors", {}, { idAttribute: "email" });
const textSchema = new schema.Entity(
  "texts",
  {
    author: authorSchema,
  },
  { idAttribute: "_id" }
);
const chatSchema = [textSchema];

class MessagesController {
  constructor() {
    this.messages = [];
  }

  getData = async (req, res) => {
    try {
      const messages = await model.find({});
      // console.log(messages);
      const normalizedMessages = normalize(messages, [textSchema]);
      // console.log(util.inspect(normalizedMessages, true, 10, true));
      console.log(
        denormalize(
          normalizedMessages.result,
          [textSchema],
          normalizedMessages.entities
        )
      );
      res.json(normalizedMessages);
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
