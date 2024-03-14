const { ObjectId } = require('mongodb');

const { Database } =  require('../database/index');

const { productsUtils } = require('./utils');

const COLLECTION = `products`;

const getALL = async () => {
    const collection = await Database (COLLECTION);
    return await collection.find({}).toArray();

};

const getByid = async (id) => {
    const collection = await Database (COLLECTION);
    return collection.findOne({_id:new ObjectId(id)});
};

const create = async (product) => {
    const collection = await Database(COLLECTION);
    let result = await collection.insertOne(product);
    return result.insertedId
};

const update = async (id, updates) => {
    const collection = await Database(COLLECTION);
    await collection.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    return updates;
};

const deleteProduct = async (id) => {
    const collection = await Database(COLLECTION);
    let result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
};

const generateReport = async (name, res) =>{
    let products = await getALL();
    productsUtils.excelGenerator(products, name, res)

};

module.exports.ProductsService = {
    getALL,
    getByid,
    create,
    update,
    deleteProduct,
    generateReport,
};