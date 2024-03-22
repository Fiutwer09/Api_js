const createError = require("http-errors");

const debug = require("debug")(`app:module-sales-controller`);

const { SalesService } = require("./services");
const { Response } = require("../common/response");

module.exports.SalesController = {
  getSales: async (req, res) => {
    try {
      let sales = await SalesService.getALL();
      Response.success(res, 200, `Lista de Ventas`, sales);
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },

  getSale: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;
      let sale = await SalesService.getByid(id);
      if (!sale) {
        Response.error(res, new createError.NotFound());
      } else {
        Response.success(res, 200, `Usuario ${id}`, sale);
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
  //creamos la venta

  createSale: async (req, res) => {
    try {
      const { body } = req;
      let { iduser } = req.body; //obtenemos id de usuario y producto
      let { idprod } = req.body;

      let cantidadB = req.body.cantidad; //obetenemos el campo "cantidad" del body

      //verificamos si el id de producto y usuario existen en la base de datos
      let user = await SalesService.getIdUser(iduser);
      let product = await SalesService.getIdProd(idprod);

      //obtenemos la resta de la cantidad comprada y la del stock disponible
      newCant = product.cantidad - cantidadB;

      if (!product || product.cantidad === null) {
        // Manejar el caso en el que el producto no se encontró o la cantidad es nula
        Response.error(res, new createError.NotFound());
      } else {
        if (product && product.cantidad >= cantidadB) {
          const insertedId = await SalesService.create(body);
          const productUp = await SalesService.updateProd(idprod, newCant);
          // Agrega un mensaje para indicar que el producto también se ha actualizado
          const successMessage = `Venta Registrada. Producto actualizado: ${productUp}`;
          Response.success(res, 201, successMessage, insertedId);
        } else {
          // Agrega una respuesta si el producto no está disponible
          Response.error(res, new createError.NotAcceptable());
        }
      }
    } catch (error) {
      debug(error);
      res.status(500).json({
        message: `interval server error create product in controller.js`,
      });
    }
  },

  // Actualizar una venta existente
  updateSale: async (req, res) => {
    try {
      const {
        params: { id },
        body: { cantidad }, // Obtener la nueva cantidad desde el cuerpo de la solicitud
      } = req;

      // Obtener la venta existente por su ID
      const sale = await SalesService.getByid(id);

      // Verificar si la venta existe
      if (!sale) {
        // Si la venta no existe, enviar una respuesta de error
        Response.error(res, new createError.NotFound());
      } else {
        // Actualizar la cantidad de la venta con la nueva cantidad proporcionada
        sale.cantidad = cantidad;

        // Guardar los cambios en la base de datos
        const updatedSale = await SalesService.updateSale(id, sale);

        // Enviar una respuesta de éxito con la venta actualizada
        Response.success(res, 200, `Venta actualizada`, updatedSale);
      }
    } catch (error) {
      // Manejar cualquier error que pueda ocurrir durante el proceso de actualización
      debug(error);
      Response.error(res);
    }
  },

  updateSales: async (req, res) => {
    try {
      const {
        params: { id },
        body,
      } = req;
      const updatedUser = await SalesService.update(id, body);
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

  deleteSale: async (req, res) => {
    try {
      const {
        params: { id },
      } = req;
      const deletedUser = await SalesService.deleteSale(id);
      if (!deletedUser) {
        Response.error(res, new createError.NotFound());
      } else {
        Response.success(res, 200, `Usuario ${id} eliminado`);
      }
    } catch (error) {
      debug(error);
      Response.error(res);
    }
  },
};
