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
    res.send('Bienvenido a la API MENU')
  })
router.route('/Obtenermenu')
  .post((req, res) => {
    var pool = bd.AbrirConexionPool();
    const sql = 'SELECT * FROM MENU';
    listado = [];
    var l = [];
    /*ejecuta la primera consulta asincrona */
    pool.query(sql, async function (error, result) {
      if (error) throw error;
      if (result.length > 0) {
        for (var i = 0; i < result.length; i++) {
          var sql1 = `SELECT b.* FROM MENU b WHERE b.IDMENU='${result[i].IDMENU}'`;
          var paginarol = await bd.getResult(sql1, pool)
          const elemento = {
            IDMENU: result[i].IDMENU,
            NOMBREMENU: result[i].NOMBREMENU,
            DESCRIPCION: result[i].DESCRIPCION,
            IDAPLICACION: result[i].IDAPLICACION,
            ACTIVO: result[i].ACTIVO,
            PAGINA_ARRAY: paginarol,
          };
          listado.push(elemento);
        }
        pool.end() /*cierra el pool de conexion*/
        res.json(listado);
      } else {
        let result = {
          'status': "Success",
          "msg": "OK",
          "data": "No hay datos"
        };
        res.json(result);
      }
    });
  })
router.route('/ObtenerListadoMenuxAplicacion').post((req, res) => {
  var pool = bd.AbrirConexionPool();
  const sql = `SELECT * FROM MENU WHERE IDAPLICACION='${req.body.IDAPLICACION}'`;
  listado = [];
  var l = [];
  /*ejecuta la primera consulta asincrona */
  pool.query(sql, async function (error, result) {
    if (error) throw error;
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        var sql1 = `SELECT b.* FROM MENU b WHERE b.IDMENU='${result[i].IDMENU}'`;
        var paginarol = await bd.getResult(sql1, pool)
        const elemento = {
          IDMENU: result[i].IDMENU,
          NOMBREMENU: result[i].NOMBREMENU,
          DESCRIPCION: result[i].DESCRIPCION,
          IDAPLICACION: result[i].IDAPLICACION,
          ACTIVO: result[i].ACTIVO,
          PAGINA_ARRAY: paginarol,
        };
        listado.push(elemento);
      }
      pool.end() /*cierra el pool de conexion*/
      res.json(listado);
    } else {
      let result = {
        'status': "Success",
        "msg": "OK",
        "data": "No hay datos"
      };
      res.json(result);
    }
  });
})
router.route('/CudMenu').post((req, res) => {
  var pagina_array = req.body.PAGINA_ARRAY;
  if (req.body.IDMENU = '') {
    const data = [
      req.body.NOMBREMENU,
      req.body.DESCRIPCION,
      req.body.IDAPLICACION,
      req.body.ACTIVO,
      req.body.IDMENU
    ]
    let sql = `UPDATE MENU
     SET NOMBREMENU= ?,
     DESCRIPCION=?,
     IDAPLICACION=?,
     ACTIVO=?,
     WHERE IDMENU = ?`;
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      console.log('Rows affected:', results.affectedRows);
    });
  } else {
    const sql = 'INSERT INTO ROL SET ?';
    const data = {
      NOMBREMENU: req.body.NOMBREMENU,
      DESCRIPCION: req.body.DESCRIPCION,
      IDAPLICACION: req.body.IDAPLICACION,
      ACTIVO: req.body.ACTIVO,
      IDMENU: req.body.IDMENU,
    }
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        let result = {
          'status': "NoSuccess",
          "msg": "ERROR",
          "data": "error en el guardado!!!"
        };
        res.json(result);
      }
      //        console.log('Rows affected:', results.affectedRows);
      let result = {
        'status': "Success",
        "msg": "OK",
        "data": "Datos guardados correctamente"
      };
      res.json(result);
    });
  }
})
module.exports = router;
