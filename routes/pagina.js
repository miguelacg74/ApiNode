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
    res.send(' Bienvenido a la API PAGINA ')
  })
router.route('/ObtenerPaginasMenu').post((req, res) => {
  var filtro = '';
  var pool = bd.AbrirConexionPool();
  if (req.body.perfil != undefined && req.body.perfil != '') {
    filtro = req.body.perfil;
  }
  var idmenu = req.body.idmenu;
  var sql = `SELECT PAGINA.* FROM PAGINA INNER JOIN MENU ON MENU.IDMENU=PAGINA.IDMENU  WHERE MENU.IDMENU=${idmenu}`
  console.log(sql)
  listado = [];
  var l = [];
  /*ejecuta la primera consulta asincrona */
  pool.query(sql, async function (error, result) {
    if (error) throw error;
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        const elemento = {
          IDMENU: result[i].IDMENU,
          IDPAGINA: result[i].IDPAGINA,
          NOMBRE: result[i].NOMBRE,
          DESCRIPCION: result[i].DESCRIPCION,
          IDPADRE: result[i].IDPADRE,
          MENU: result[i].MENU,
          RUTA: result[i].RUTA,
          GENERICA: result[i].GENERICA,
          CSS: result[i].CSS,
        };
        listado.push(elemento);
      }
      pool.end() /*cierra el pool de conexion*/
      let resultado = {
        'status': "Success",
        'url': "Home/Index",
        "data": listado
      };
      res.json(resultado);
    } else {
      res.send({
        'status': "noSuccess",
        'url': "",
        "UserDisplayName": "",
        "data": null
      })
    }
  });
})
router.route('/ObtenerPaginas').post((req, res) => {
  var filtro = '';
  var pool = bd.AbrirConexionPool();
  if (req.body.PERFIL != undefined && req.body.PERFIL != '') {
    filtro = req.body.PERFIL;
  }
  var sql = `SELECT PAGINA.* FROM PAGINA   WHERE IDMENU=1`
  console.log(sql)
  listado = [];
  var l = [];
  /*ejecuta la primera consulta asincrona */
  pool.query(sql, async function (error, result) {
    if (error) throw error;
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        const elemento = {
          IDMENU: result[i].IDMENU,
          IDPAGINA: result[i].IDPAGINA,
          NOMBRE: result[i].NOMBRE,
          DESCRIPCION: result[i].DESCRIPCION,
          IDPADRE: result[i].IDPADRE,
          MENU: result[i].MENU,
          RUTA: result[i].RUTA,
          GENERICA: result[i].GENERICA,
          CSS: result[i].CSS,
        };
        listado.push(elemento);
      }
      pool.end() /*cierra el pool de conexion*/
      let resultado = {
        'status': "Success",
        'url': "Home/Index",
        "data": listado
      };
      res.json(resultado);
    } else {
      res.send({
        'status': "noSuccess",
        'url': "",
        "UserDisplayName": "",
        "data": null
      })
    }
  });
})
router.route('/CudPagina').post((req, res) => {
  var pagina_array = req.body.PAGINA_ARRAY;
  if (req.body.IDROL = '') {
    const data = [
      req.body.NOMBRE_PERFIL,
      req.body.ESTADO,
      req.body.DESCRIPCION,
      req.body.IDAPLICACION,
      req.body.ID_PERFIL,
      req.body.IDROL
    ]
    let sql = `UPDATE ROL
           SET NOMBRE= ?,
           ACTIVO=?,
           DESCRIPCION=?,
           IDAPLICACION=?,
           CODROL=?
           WHERE IDROL = ?`;
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      console.log('Rows affected:', results.affectedRows);
    });
  } else {
    const sql = 'INSERT INTO ROL SET ?';
    const data = {
      NOMBRE: req.body.NOMBRE_PERFIL,
      ACTIVO: req.body.ESTADO,
      DESCRIPCION: req.body.DESCRIPCION,
      IDAPLICACION: req.body.IDAPLICACION,
      CODROL: req.body.ID_PERFIL,
      IDROL: req.body.IDROL,
    }
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      console.log('Rows affected:', results.affectedRows);
    });
  }
})
module.exports = router;
