//Este archivo agrega todas las rutas necesarias detro de la aplicacion trabajndo de froma independiente
const express = require('express');

const{ ProductsController } = require('./controller');

const router = express.Router();

module.exports.ProductsAPI =(app) =>{
    router
    .get(`/`,ProductsController.getProducts)//http://localhost:3000/api/products/
    .get(`/report`, ProductsController.generateReport)
    .get(`/:id`,ProductsController.getProduct)//http://localhost:3000/api/products/23
    .post(`/`,ProductsController.createProducts)
    .put('/:id', ProductsController.updateProduct)
    .delete('/:id', ProductsController.deleteProduct);

    app.use(`/api/products` ,router);
};

