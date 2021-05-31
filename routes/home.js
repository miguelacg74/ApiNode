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
    res.send(' Bienvenido a API HOME  ')
  })
router.route('/MenuAngular/:login/:idaplicacion').post((req, res) => {
  var sql = `SELECT 
  P.IDPAGINA,
  P.NOMBRE,
  P.IDPADRE,
  P.MENU,
  P.RUTA,
  P.GENERICA,
  P.CSS FROM arquitectura.PAGINA P
  INNER JOIN arquitectura.PAGINAROL  PR ON P.IDPAGINA=PR.IDPAGINA 
  AND PR.IDROL IN (SELECT RU.IDROL FROM arquitectura.USUARIO U
  INNER JOIN  arquitectura.ROL_USUARIO RU ON RU.IDUSUARIO=U.IDUSUARIO
  WHERE LOGIN='${req.params.login}'  AND IDAPLICACION='${req.params.idaplicacion}')
  INNER JOIN arquitectura.MENU  M ON M.IDMENU=P.IDMENU  AND M.IDAPLICACION='${req.params.idaplicacion}'
  GROUP BY P.IDPAGINA,P.NOMBRE,P.IDPADRE,P.MENU,P.RUTA,P.GENERICA,P.CSS`;
  resultado = connection.query(sql, function (error, results, fields) {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      var resultado = {
        "status": "nosuccess"
      }
      res.json(resultado);
    }
  });
})
module.exports = router;