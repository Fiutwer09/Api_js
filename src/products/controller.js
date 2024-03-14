const createError = require('http-errors');

const debug = require('debug')(`app:module-products-controller`);


const{ ProductsService } = require('./services');
const { Response } = require('../common/response');

module.exports.ProductsController={
    getProducts : async (req, res) => {
        try {
            let products = await ProductsService.getALL()
            Response.success(res,200, `Lista de productos`, products)
        } catch (error) {
            debug(error);
            Response.error(res)
        }
    },
    getProduct : async (req, res) => {
        try {
            const { params :{id}} = req;
            let product = await ProductsService.getByid (id)
            if (!product) {
                Response.error(res, new createError.NotFound())
            } else {
                Response.success(res,200, `Producto ${id}`, product)
            }
        } catch (error) {
            debug(error);
            Response.error(res)
        }
        
    },
    createProducts : async (req, res) => {
        try {
            const { body } = req;
            if (!body || Object.keys(body).length === 0) {
                Response.error(res, new createError.BadRequest())
            } else {
                const insertedId = await ProductsService.create(body)
                Response.success(res, 201, `Producto agregado`, insertedId)
            }
        } catch (error) {
            debug(error);
            Response.error(res)
        }
    },
    updateProduct: async (req, res) => {
        try {
            const { params: { id }, body } = req;
            const updatedProduct = await ProductsService.update(id, body);
            if (!updatedProduct) {
                Response.error(res, new createError.NotFound());
            } else {
                Response.success(res, 200, `Producto ${id} actualizado`, updatedProduct);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    }, 
    
    deleteProduct: async (req, res) => {
        try {
            const { params: { id } } = req;
            const deletedProduct = await ProductsService.deleteProduct(id);
            if (!deletedProduct) {
                Response.error(res, new createError.NotFound());
            } else {
                const productDetails = { id: deletedProduct._id, name: deletedProduct.name, precio: deletedProduct.precio, cantidad: deletedProduct.cantidad};
                Response.success(res, 200, `Producto ${id} eliminado`, productDetails);
            }
        } catch (error) {
            debug(error);
            Response.error(res);
        }
    },

    generateReport: (req,res)=>{
        try {
            ProductsService.generateReport(`Inventario`, res);
        } catch (error) {
            debug(error);
            Response.error(res);
        }

    }
};