const express = require('express');
const router = express.Router()
const Conexion = require("../BL/ConexionBD.js");
const CrudGenericoBL = require("../BL/CrudGenericoBL.js");
var bd = new Conexion();
var connection = bd.AbrirConexion();
var crudGenerico = new CrudGenericoBL(connection);
router.route('/')
  .get((req, res) => {
    //  validateID(req.params.id);
    res.send(' Bienvenido a la API APLICACION ')
  })
  
router.route('/ObtenerAplicacion').post((req, res) => {
  var filtroAplicacion = '';
  var filtroDescripcion = '';
  var pool = bd.AbrirConexionPool();
  if (req.body.APLICACION != undefined && req.body.APLICACION != '' ) {
    filtroAplicacion = req.body.APLICACION;
  }
  if (req.body.DESCRIPCION != undefined && req.body.DESCRIPCION != '') {
  var filtroDescripcion = req.body.DESCRIPCION;
  }
  
  
  var sql = `SELECT R.* FROM APLICACION R `;
  if (filtroDescripcion != '' && filtroAplicacion == '') {
    if (filtroAplicacion != '') {
      sql = sql + ` WHERE R.DESCRIPCION like '%${filtroDescripcion}%' AND R.APLICACION LIKE '%${filtroAplicacion}%'`;
    } else {
      sql = sql + ` WHERE R.DESCRIPCION='%${filtroDescripcion}%'`;
    }
  } else {
    if (filtroAplicacion != ''  && filtroDescripcion == '') {
      sql = sql + ` WHERE  R.APLICACION LIKE '%${filtroAplicacion}%'`;
    }
  }
  listado = [];
  var l = [];
  /*ejecuta la primera consulta asincrona */
  console.log('=====================================')
  console.log(sql)
  console.log('=====================================')
  
  pool.query(sql, async function (error, result) {
    if (error) throw error;
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        var sql1 = `SELECT b.* FROM APLICACION b WHERE b.IDAPLICACION=${result[i].IDAPLICACION}`;
        var paginarol = await bd.getResult(sql1, pool)
        const elemento = {
          IDAPLICACION: result[i].IDAPLICACION,
          APLICACION: result[i].APLICACION,
          DESCRIPCION: result[i].DESCRIPCION,
          URL: result[i].URL,
          ACTIVO: result[i].ACTIVO,
          PAGINA_ARRAY: paginarol
        };
        listado.push(elemento);
      }
      pool.end() /*cierra el pool de conexion*/
      console.log(listado)
      res.json(listado);
    } else {
      res.send('no hay datos')
    }
  });
})
module.exports = router;
