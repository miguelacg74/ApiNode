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
    res.send(' Bienvenido a la API PERFILES ')
  })
router.route('/ObtenerPerfil').post((req, res) => {
  var filtro = '';
  var pool = bd.AbrirConexionPool();
  if (req.body.perfil != undefined && req.body.perfil != '') {
    filtro = req.body.perfil;
  }
  var filtroIdaplicacion = req.body.idaplicacion;
  var filtroidusuario = req.body.idusuario;
  var sql = `SELECT A.APLICACION,R.IDROL,R.NOMBRE,R.DESCRIPCION,R.CODROL,R.IDAPLICACION,
  R.ACTIVO FROM ROL R INNER JOIN APLICACION A ON A.IDAPLICACION=R.IDAPLICACION 
  INNER JOIN APLICACION_USUARIO AU ON AU.IDAPLICACION=A.IDAPLICACION `;
  if (filtroIdaplicacion != 0 && filtroidusuario == 0) {
    if (filtro != '') {
      sql = sql + ` WHERE R.IDAPLICACION=${filtroIdaplicacion} AND R.NOMBRE LIKE '%${filtro}%'`;
    } else {
      sql = sql + ` WHERE R.IDAPLICACION=${filtroIdaplicacion}`;
    }
  } else {
    if (filtro != '' && filtroidusuario == 0 && filtroIdaplicacion == 0) {
      sql = sql + ` WHERE  R.NOMBRE LIKE '%${filtro}%'`;
    }
  }
  if (filtroIdaplicacion != 0 && filtroidusuario != 0) {
    if (filtro != '') {
      sql = sql + ` WHERE R.IDAPLICACION=${filtroIdaplicacion} AND AU.IDUSUARIO= ${filtroidusuario} AND R.NOMBRE LIKE '%${filtro}%'`;
    } else {
      sql = sql + ` WHERE R.IDAPLICACION=${filtroIdaplicacion} AND AU.IDUSUARIO= ${filtroidusuario} `;
    }
  } else {
    if (filtro != '' && filtroidusuario != 0) {
      sql = sql + ` WHERE  R.NOMBRE LIKE '%${filtro}%' AND AU.IDUSUARIO= ${filtroidusuario} `;
    }
    if (filtro == '' && filtroidusuario != 0) {
      sql = sql + ` WHERE   AU.IDUSUARIO= ${filtroidusuario} `;
    }
  }
  sql = sql + ` GROUP BY A.APLICACION,R.IDROL,
            R.NOMBRE,R.DESCRIPCION,R.CODROL,
            R.IDAPLICACION,R.ACTIVO`;
  listado = [];
  var l = [];
  /*ejecuta la primera consulta asincrona */
  pool.query(sql, async function (error, result) {
    if (error) throw error;
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        var sql1 = `SELECT b.* FROM 
            PAGINAROL a INNER JOIN PAGINA b  
            on a.idpagina=b.idpagina  
            WHERE a.IDROL='${result[i].IDROL}'`;
        var paginarol = await bd.getResult(sql1, pool)
        const elemento = {
          IDROL: result[i].IDROL,
          NOMBRE: result[i].NOMBRE,
          DESCRIPCION: result[i].DESCRIPCION,
          APLICACION: result[i].APLICACION,
          ACTIVO: result[i].ACTIVO,
          IDAPLIACION: result[i].IDAPLICACION,
          CODROL: result[i].CODROL,
          PAGINA_ARRAY: paginarol
        };
        listado.push(elemento);
      }
      pool.end() /*cierra el pool de conexion*/
      res.json(listado);
    } else {
      res.send('no hay datos')
    }
  });
})
router.route('/CudPerfil').post((req, res) => {
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