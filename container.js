const fs = require("fs").promises;

const PATH = "./productos.txt";

// Productos base
const initialState = [
  {
    id: 1,
    title: "Escuadra",
    price: 123.45,
  },
  {
    id: 2,
    title: "Calculadora",
    price: 234.56,
  },
  {
    id: 3,
    title: "Globo Terráqueo",
    price: 345.67,
  },
];

// CONTENEDOR
class Contenedor {
  constructor(file) {
    this.file = file;

    // Inicio el ID con el ID más grande de los productos de initialState
    this.id = 3;
  }

  getObjects = async () => {
    try {
      const data = await fs.readFile(this.file);
      return JSON.parse(data);
    } catch (err) {
      console.log("Hubo un error :(", err);
    }
  };

  // save(Object): Number - Recibe un objeto, lo guarda en el archivo, devuelve el ID asignado.
  save = async (object) => {
    const id = ++this.id;
    try {
      const objects = await this.getObjects();

      objects.push({ id, ...object });

      await fs.writeFile(this.file, JSON.stringify(objects));
      return id;
    } catch (err) {
      console.log("hubo un error :(", err);
    }
  };

  // getById(Number): Object - Recibe un ID y devuelve el objeto con ese id, o null si no está
  getById = async (id) => {
    try {
      const objects = await this.getObjects();
      const object = objects.find((obj) => obj.id === id);

      if (object) return object;
      else return null;
    } catch (err) {
      console.log("hubo un error :(", err);
    }
  };

  // getAll(): Object[] - Devuelve un array con los objetos presentes en el archivo
  getAll = async () => {
    try {
      const objects = await this.getObjects();
      return objects;
    } catch (err) {
      console.log("Hubo un error :(", err);
    }
  };

  // deleteById(Number): void - Elimina del archivo el objeto con el id buscado
  deleteById = async (id) => {
    try {
      const objects = await this.getObjects();
      const newObjects = objects.filter((obj) => obj.id !== id);
      await fs.writeFile(this.file, JSON.stringify(newObjects));
    } catch (err) {
      console.log("Hubo un error :( ", err);
    }
  };

  // deleteAll(): void - Elimina todos los objetos presentes en el archivo
  deleteAll = async () => {
    try {
      const objects = [];
      await fs.writeFile(this.file, JSON.stringify(objects));
    } catch (err) {
      console.log("Hubo un error :(", err);
    }
  };
}

const contenedor = new Contenedor(PATH);

module.exports = contenedor;

// (async () => {
//   // Agregamos los productos base al archivo
//   await fs.writeFile(PATH, JSON.stringify(initialState));

//   // Agregamos producto 3
//   const productoAgregado = await contenedor.save({
//     title: "Lápiz",
//     price: 456.78,
//   });
//   console.log("ID del producto agregado: ", productoAgregado);

//   // Buscamos el producto con id 2
//   const producto2 = await contenedor.getById(2);
//   console.log("Producto 2: ", producto2);

//   // Tomamos todos los productos
//   const productos = await contenedor.getAll();
//   console.log("Todos los productos: ", productos);

//   // Eliminamos el producto con id 1
//   await contenedor.deleteById(1);
//   console.log("Producto 1 eliminado: ", await contenedor.getAll());

//   // Eliminamos todos los productos
//   await contenedor.deleteAll();
//   console.log("Todos los productos eliminados: ", await contenedor.getAll());
// })();
