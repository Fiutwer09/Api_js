//Este archivo agrega todas las rutas necesarias detro de la aplicacion trabajndo de froma independiente
const express = require('express');

const{ SalesController } = require('./controller');

const router = express.Router();

module.exports.SaleAPI =(app) =>{
    router
    .get(`/`,SalesController.getSales)//http://localhost:3000/api/users/
    .get(`/:id`,SalesController.getSale)//http://localhost:3000/api/users/id: 123
    .post(`/`,SalesController.createSale)
    .put('/:id', SalesController.updateSale)
    .put('/:id', SalesController.updateSales)
    .delete('/:id', SalesController.deleteSale);

    app.use(`/api/sales`,router);
};