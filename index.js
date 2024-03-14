const express = require(`express`);
const debug = require(`debug`)(`app:main`);

const { Config } = require(`./src/config/index`);
const{ ProductsAPI } = require(`./src/products/index`);
const { UserAPI } = require('./src/users/index');
const { SaleAPI } = require('./src/sales/index');
const { IndexAPI,NotFoundAPI} = require('./src/index/index');

const app = express();

app.use(express.json());

//modulos
IndexAPI(app);
ProductsAPI(app);
UserAPI(app);
SaleAPI(app);
NotFoundAPI(app);

app.listen(Config.port, () => {
    debug(`Servidor escuchando en el puerto ${Config.port}`)
});