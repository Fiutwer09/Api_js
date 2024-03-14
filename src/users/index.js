//Este archivo agrega todas las rutas necesarias detro de la aplicacion trabajndo de froma independiente
const express = require('express');

const{ UsersController } = require('./controller');

const router = express.Router();

module.exports.UserAPI =(app) =>{
    router
    .get(`/`,UsersController.getUsers)//http://localhost:3000/api/users/
    .get(`/:id`,UsersController.getUser)//http://localhost:3000/api/users/id: 123
    .post(`/`,UsersController.createUser)
    .put('/:id', UsersController.updateUser)
    .delete('/:id', UsersController.deleteUser);

    app.use(`/api/users`,router);
};