//aqui se obtienen todos los productos limpiandolos para que trabajen de forma adecuada en el momento de generar el excel.
const excelGenerator = (products, name ,res)=>{
const xl = require('excel4node');
    
    products = products.map((product)=>{
        let id = product._id.toString();
        delete product._id;
        return {
            id,
            ...product
        }

    });
//aqui generamos el libro excel work book
    let wb = new xl.Workbook();
    let ws = wb.addWorksheet(`Inventario`); //Este crea una nueva hoja en excel con el nombre de `Inventario`

    //aqui iongresamos los datos dentro de la hoja nueva llamada `Inventario`
    for (let i = 1; i <= products.length; i++) {
        for (let j = 1; j <= Object.values(products[0]).length; j++) {
            let data = Object.values(products[i - 1])[j - 1] // valores para el primer elemento como empieza en 1 se le resta 1 
            if (typeof data === `string`) {
                ws.cell(i,j).string(data)
            } else {
                ws.cell(i,j).number(data);
            }
        }
        
    }

    wb.write(`${name}.xlsx`, res) //la libreria dice que si queremos enviar el archiva devemos pasar el metodo response al metodo write

};

module.exports.productsUtils = {
    excelGenerator,
};
