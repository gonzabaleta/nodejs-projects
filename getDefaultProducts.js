const getDefaultProducts = () => [
  {
    id: 1,
    title: "Fideos",
    description: "Fideos muy ricos para toda la familia",
    sku: "234928",
    imageURL:
      "https://www.cica.com.ar/wp-content/uploads/sites/127/2020/04/Celentano-1-220x300.jpg",
    price: 80,
    stock: 150,
  },
  {
    id: 2,
    title: "Arroz",
    description: "Arroz muy rico para toda la familia",
    sku: "347829347",
    imageURL:
      "https://www.hogarmania.com/archivos/202204/como-hacer-arroz-blanco-xl-1280x720x80xX.jpg",
    price: 100,
    stock: 483,
  },
  {
    id: 3,
    title: "Queso",
    description: "Queso muy rico para toda la familia",
    sku: "472834792",
    imageURL:
      "https://statics-cuidateplus.marca.com/cms/styles/natural/azblob/quesos-variados_0.jpg.webp?itok=MtVOSyJc",
    price: 300,
    stock: 893,
  },
];

module.exports = { getDefaultProducts };
