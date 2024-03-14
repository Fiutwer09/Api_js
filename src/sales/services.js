const { ObjectId } = require("mongodb");

const { Database } = require("../database/index");

const COLLECTION = 'sales';
const COLLECTION2 = 'users';
const COLLECTION3 = 'products';


const getALL = async () => {
    const collection = await Database (COLLECTION);
    return await collection.find({}).toArray();

};

const getByid = async (id) => {
    const collection = await Database (COLLECTION);
    return collection.findOne({_id:new ObjectId(id)});
};
 
//crear venta
const create = async (sale) => {
    const collection = await Database(COLLECTION);
    let result = await collection.insertOne(sale);
    return result.insertedId;
};
 
//obtener info de user
const getIdUser = async (iduser) => {
    const collection = await Database(COLLECTION2);
    return collection.findOne({ _id: new ObjectId(iduser) });
};
 
//obtener info de product
const getIdProd = async (idprod) => {
    const collection = await Database(COLLECTION3);
    return collection.findOne({ _id: new ObjectId(idprod) });
};

const updateSale = async (id, updates) => {
    const collection = await Database(COLLECTION);
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    return updates;
};
 
//actualizar el product una vez registrada la venta
const updateProd = async (productId, newCant) => {
    try {
        const collection = await Database(COLLECTION3);
        const result = await collection.updateOne(
            { _id: new ObjectId(productId) }, 
            { $set: { "cantidad": newCant } }
        );
        
        if (result.modifiedCount === 1) {
            // La actualización se realizó correctamente
            return true;
        } else {
            // No se modificó ningún documento, lo que puede indicar que el ID no se encontró
            return false;
        }
    } catch (error) {
        // Manejar cualquier error que pueda ocurrir durante la actualización
        console.error("Error al actualizar el producto:", error);
        return false;
    }
};

const deleteSale = async (saleId) => {
    const salesCollection = await Database(COLLECTION);
    const productsCollection = await Database(COLLECTION3);
    
    // Buscar la venta por su ID
    const sale = await salesCollection.findOne({ _id: new ObjectId(saleId) });

    if (!sale) {
        return false; // La venta no existe
    }

    // Eliminar la venta de la colección de ventas
    const deleteResult = await salesCollection.deleteOne({ _id: new ObjectId(saleId) });

    if (deleteResult.deletedCount === 0) {
        return false; // No se pudo eliminar la venta
    }

    // Actualizar la cantidad del producto sumando la cantidad de la venta eliminada
    const productUpdateResult = await productsCollection.updateOne(
        { _id: new ObjectId(sale.productId) }, 
        { $inc: { cantidad: sale.cantidad } } // Incrementar la cantidad
    );

    if (productUpdateResult.modifiedCount === 0) {
        // Si no se modificó ningún documento, revertir la eliminación de la venta
        await salesCollection.insertOne(sale); // Insertar nuevamente la venta eliminada
        return false;
    }

    return true; // La venta se eliminó correctamente y la cantidad del producto se actualizó
};

 
module.exports.SalesService = {
    getALL,
    getByid,
    create,
    getIdUser,
    getIdProd,
    updateSale,
    updateProd,
    deleteSale,
};