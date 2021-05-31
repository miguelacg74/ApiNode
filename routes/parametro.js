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
    res.send(' Bienvenido a la API PARAMETRO ')
  })
router.route('/ObtenerParametro').post((req, res) => {
  var filtro = '';
  var pool = bd.AbrirConexionPool();
  if (req.body.perfil != undefined && req.body.perfil != '') {
    filtro = req.body.perfil;
  }
  var filtroIdaplicacion = req.body.idaplicacion;
  var filtroidusuario = req.body.idusuario;
  var filtroDescripcion = req.body.descripcion;
  var filtroValor = req.body.valor;
  var filtroNombre = req.body.nombre;
  filtro = ` WHERE IDAPLICACION='${filtroIdaplicacion}'`;
  if (filtroDescripcion != '' && filtroValor != '' && filtroNombre != '' && filtroDescripcion != '' && filtroDescripcion != undefined && filtroValor != undefined && filtroNombre != undefined) {
    filtro = ` WHERE  IDAPLICACION='${filtroIdaplicacion}' AND  DESCRIPCION LIKE '%${filtroDescripcion}%' AND VALOR = '${filtroValor}' AND PARAMETRO LIKE '%${filtroValor}%'`;
  }
  if (filtroDescripcion != '' && filtroValor == '' && filtroNombre != '' && filtroNombre != undefined && filtroDescripcion != undefined) {
    filtro = ` WHERE IDAPLICACION='${filtroIdaplicacion}' AND DESCRIPCION LIKE '%${filtroDescripcion}%'  AND PARAMETRO LIKE '%${filtroValor }%'`;
  }
  if (filtroDescripcion != '' && filtroValor == '' && filtroNombre == '' && filtroDescripcion != undefined) {
    filtro = ` WHERE IDAPLICACION='${filtroIdaplicacion}' AND DESCRIPCION LIKE '%${filtroDescripcion}%' `;
  }
  if (filtroDescripcion == '' && filtroValor != '' && filtroNombre != '' && filtroNombre != undefined && filtroValor != undefined) {
    filtro = ` WHERE IDAPLICACION='${filtroIdaplicacion}' AND VALOR = '${filtroValor }' AND PARAMETRO LIKE '%${filtroValor }%'`;
  }
  if (filtroDescripcion == '' && filtroValor == '' && filtroNombre != '' && filtroNombre != undefined) {
    filtro = ` WHERE   IDAPLICACION='${filtroIdaplicacion}' AND PARAMETRO LIKE '%${filtroValor }%'`;
  }
  if (filtroDescripcion == '' && filtroValor != '' && filtroNombre == '' && filtroValor != undefined) {
    filtro = ` WHERE  IDAPLICACION='${filtroIdaplicacion}' AND VALOR = '${filtroValor }'`;
  }
  var sql = `SELECT a.* FROM PARAMETRO a INNER JOIN PARAMETRO_APLICACION b on a.IDPARAMETRO=b.IDPARAMETRO ${filtro}`
  console.log(sql)
  listado = [];
  var l = [];
  /*ejecuta la primera consulta asincrona */
  pool.query(sql, async function (error, result) {
    if (error) throw error;
    if (result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        var sql1 = `SELECT b.* FROM PARAMETRO a 
            INNER JOIN PARAMETRO_APLICACION b on 
            a.IDPARAMETRO=b.IDPARAMETRO 
            WHERE a.IDPARAMETRO='${result[0].IDPARAMETRO}'`;
        var aplicacionparametro = await bd.getResult(sql1, pool)
        const elemento = {
          IDPARAMETRO: result[i].IDPARAMETRO,
          PARAMETRO: result[i].PARAMETRO,
          DESCRIPCION: result[i].DESCRIPCION,
          VALOR: result[i].VALOR,
          ACTIVO: result[i].ACTIVO,
          IDTIPOPARAMETRO: result[i].IDTIPOPARAMETRO,
          ESPUBLICO: result[i].ESPUBLICO,
          ESEDITABLE: result[i].ESEDITABLE,
          ESENCRIPTADO: result[i].ESENCRIPTADO,
          APLICACION_ARRAY: aplicacionparametro,
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
router.route('/CudParametro').post((req, res) => {
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