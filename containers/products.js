class ProductsDBContainer {
  constructor(options, table) {
    this.knex = require("knex")(options);
    this.table = table;
  }

  createTable() {
    this.knex.schema
      .createTable(this.table, (table) => {
        table.increments("id");
        table.string("title").notNullable();
        table.integer("price").notNullable();
      })
      .then(() => console.log("Products table created"))
      .catch((err) => console.log(err));
  }

  saveProducts(products) {
    this.knex(this.table)
      .insert(products)
      .then(() => console.log("Producto(s) insertado(s)"))
      .catch((err) => console.log(err));
  }

  async getAllProducts() {
    const products = [];

    try {
      const rows = await this.knex(this.table).select("*");

      for (const row of rows) {
        const product = {
          id: row["id"],
          title: row["title"],
          price: row["price"],
        };

        products.push(product);
      }

      return products;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = { ProductsDBContainer };
