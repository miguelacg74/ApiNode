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
router.route('/MenuAngular').post((req, res) => {
  var sql = `SELECT 
  P.IDPAGINA,
  P.NOMBRE,
  P.IDPADRE,
  P.MENU,
  P.RUTA,
  P.GENERICA,
  P.CSS FROM PAGINA P
  INNER JOIN PAGINAROL  PR ON P.IDPAGINA=PR.IDPAGINA 
  AND PR.IDROL IN (SELECT RU.IDROL FROM USUARIO U
  INNER JOIN  ROL_USUARIO RU ON RU.IDUSUARIO=U.IDUSUARIO
  WHERE LOGIN='${req.body.LOGIN}'  AND IDAPLICACION='${req.body.IDAPLICACION}')
  INNER JOIN MENU  M ON M.IDMENU=P.IDMENU  AND M.IDAPLICACION='${req.body.IDAPLICACION}'
  GROUP BY P.IDPAGINA,P.NOMBRE,P.IDPADRE,P.MENU,P.RUTA,P.GENERICA,P.CSS`;
  
  console.log('menuangular===================================')
  
  console.log(sql)
  
  console.log('menuangular===================================')
  
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
