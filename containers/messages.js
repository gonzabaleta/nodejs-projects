class MessagesDBContainer {
  constructor(options, table) {
    this.knex = require("knex")(options);
    this.table = table;
  }

  createTable() {
    this.knex.schema
      .createTable(this.table, (table) => {
        table.increments("id");
        table.string("email").notNullable();
        table.string("message").notNullable();
        table.string("date").notNullable();
      })
      .then(() => console.log("Messages table created"))
      .catch((err) => console.log(err));
  }

  async saveMessages(messages) {
    try {
      await this.knex(this.table).insert(messages);
      console.log("mensajes insertados");
    } catch (err) {
      console.log(err);
    }
  }

  async getAllMessages() {
    const messages = [];

    try {
      const rows = await this.knex(this.table).select("*");

      for (const row of rows) {
        const message = {
          id: row["id"],
          email: row["email"],
          message: row["message"],
          date: row["date"],
        };

        messages.push(message);
      }

      return messages;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = { MessagesDBContainer };
