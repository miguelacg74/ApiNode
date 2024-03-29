const express = require('express');
const bodyParser = require('body-parser');
const Conexion = require("./BL/ConexionBD.js");
const CrudGenericoBL = require("./BL/CrudGenericoBL.js");
/*-----------IMPLEMENTAR LAS CLASES DE LOS DISTINTAS CLASES------------------------*/
const atributo = require("./routes/atributo.js");
const account = require("./routes/account.js");
const home = require("./routes/home.js");
const perfiles = require("./routes/perfiles.js");
const menu = require("./routes/menu.js");
const parametro = require("./routes/parametro.js");
const pagina = require("./routes/pagina.js");
const aplicacion = require("./routes/aplicacion.js");
/*----------------------------------------------------------------------------------*/
var bd = new Conexion();
var connection = bd.AbrirConexion();
var crudGenerico = new CrudGenericoBL(connection);
const PORT = process.env.PORT || 8081;
const app = express();
app.use(bodyParser.json());
// configurar cabeceras http
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});
/*implementar los diferentes servicios de la API*/
app.use('/', atributo);
app.use('/DataUploadAPI/atributo', atributo);
app.use('/DataUploadAPI/account', account);
app.use('/DataUploadAPI/home', home);
app.use('/DataUploadAPI/perfiles', perfiles);
app.use('/DataUploadAPI/menu', menu);
app.use('/DataUploadAPI/parametro', parametro);
app.use('/DataUploadAPI/pagina', pagina);
app.use('/DataUploadAPI/aplicacion', aplicacion);
app.listen(PORT, () => console.log(`Servicio ejecutando en el Puerto: ${PORT}`));
