const createError = require('http-errors');

const debug = require('debug')(`app:module-users-controller`);


const{ UserService } = require('./services');
const { Response } = require('../common/response');

module.exports.UsersController={
    getUsers : async (req, res) => {
        try {
            let users = await UserService.getALL()
            Response.success(res,200, `Lista de Usuarios`, users)
        } catch (error) {
            debug(error);
            Response.error(res)
        }
    },
    getUser : async (req, res) => {
        try {
            const { params :{id}} = req;
            let user = await UserService.getByid (id)
            if (!user) {
                Response.error(res, new createError.NotFound())
            } else {
                Response.success(res,200, `Usuario ${id}`, user)
            }
        } catch (error) {
            debug(error);
            Response.error(res)
        }
        
    },
    createUser : async (req, res) => {
        try {
            const { body } = req;
            if (!body || Object.keys(body).length === 0) {
                Response.error(res, new createError.BadRequest())
            } else {
                const insertedId = await UserService.create(body)
                Response.success(res, 201, `Usuario agregado`, insertedId)
            }
        } catch (error) {
            debug(error);
            Response.error(res)
        }
    },
    updateUser: async (req, res) => {
        try {
            const { params: { id }, body } = req;
            const updatedUser = await UserService.update(id, body);
            if (!updatedUser) {
                Response.error(res, new createError.NotFound());
            } else {
                Response.success(res, 200, `Usuario ${id} actualizado`, updatedUser);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    }, 
    
    deleteUser: async (req, res) => {
        try {
            const { params: { id } } = req;
            const deletedUser = await UserService.deleteUser(id);
            if (!deletedUser) {
                Response.error(res, new createError.NotFound());
            } else {
                const UserDetails = { id: deletedUser._id, name: deletedUser.name, email: deletedUser.email};
                Response.success(res, 200, `Usuario ${id} eliminado`, UserDetails);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },
};