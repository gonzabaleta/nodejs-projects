const getDefaultCarts = () => [
  {
    id: 1,
    timestamp: new Date().getTime(),
    products: [
      {
        id: 1,
        timestamp: new Date().getTime(),
        title: "Fideos",
        description: "Fideos muy ricos para toda la familia",
        sku: "234928",
        imageURL:
          "https://www.cica.com.ar/wp-content/uploads/sites/127/2020/04/Celentano-1-220x300.jpg",
        price: 80,
        stock: 150,
        quantity: 2,
      },
    ],
  },
  {
    id: 2,
    timestamp: new Date().getTime(),
    products: [
      {
        id: 3,
        timestamp: new Date().getTime(),
        title: "Queso",
        description: "Queso muy rico para toda la familia",
        sku: "472834792",
        imageURL:
          "https://statics-cuidateplus.marca.com/cms/styles/natural/azblob/quesos-variados_0.jpg.webp?itok=MtVOSyJc",
        price: 300,
        stock: 893,
        quantity: 5,
      },
      {
        id: 1,
        timestamp: new Date().getTime(),
        title: "Fideos",
        description: "Fideos muy ricos para toda la familia",
        sku: "234928",
        imageURL:
          "https://www.cica.com.ar/wp-content/uploads/sites/127/2020/04/Celentano-1-220x300.jpg",
        price: 80,
        stock: 150,
        quantity: 1,
      },
    ],
  },
];

module.exports = { getDefaultCarts };
