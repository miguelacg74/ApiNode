
const express= require('express');
const router= express.Router()
const Conexion=require("../BL/ConexionBD.js");
const CrudGenericoBL=require("../BL/CrudGenericoBL.js");


var bd= new Conexion();
var connection = bd.AbrirConexion();

var crudGenerico= new CrudGenericoBL(connection);

router.route('/')
    .get((req,res)=>{
      //  validateID(req.params.id);
    res.send(' welcome to page API menu, ' + req.params.username)
})



router.route('/Obtenermenu')
    .post((req,res)=>{
      var pool = bd.AbrirConexionPool();
     const sql ='SELECT * FROM MENU';
          
          listado=[];
          var l=[];
          /*ejecuta la primera consulta asincrona */
          pool.query(sql, async function(error, result) {
          if (error) throw error;
          if (result.length>0){
            for (var i = 0; i < result.length; i++) {
              var sql1=`SELECT b.* FROM MENU b WHERE b.IDMENU='${result[i].IDMENU}'`;
                var paginarol = await bd.getResult(sql1,pool)
                  const elemento = {
                    IDMENU : result[i].IDMENU,
							      NOMBREMENU : result[i].NOMBREMENU,
							      DESCRIPCION : result[i].DESCRIPCION,
							      IDAPLICACION : result[i].IDAPLICACION,
							      ACTIVO : result[i].ACTIVO,
							      PAGINA_ARRAY :paginarol,
                  };
                  listado.push(elemento);
            }
            pool.end() /*cierra el pool de conexion*/
            res.json(listado);
          } 
          else{
          res.send('no hay datos')
          }

          });

     
})


router.route('/ObtenerListadoMenuxAplicacion').post((req,res)=>{
      var pool = bd.AbrirConexionPool();


     const sql =`SELECT * FROM MENU WHERE IDAPLICACION='${req.body.idaplicacion}'`;
    

          listado=[];
          var l=[];
          /*ejecuta la primera consulta asincrona */
          pool.query(sql, async function(error, result) {
          if (error) throw error;
          if (result.length>0){
            for (var i = 0; i < result.length; i++) {
              var sql1=`SELECT b.* FROM MENU b WHERE b.IDMENU='${result[i].IDMENU}'`;
                var paginarol = await bd.getResult(sql1,pool)
                  const elemento = {
                    IDMENU : result[i].IDMENU,
							      NOMBREMENU : result[i].NOMBREMENU,
							      DESCRIPCION : result[i].DESCRIPCION,
							      IDAPLICACION : result[i].IDAPLICACION,
							      ACTIVO : result[i].ACTIVO,
							      PAGINA_ARRAY :paginarol,
                  };
                  listado.push(elemento);
            }
            pool.end() /*cierra el pool de conexion*/
            res.json(listado);
          } 
          else{
          res.send('no hay datos')
          }

          });

     
})

module.exports = router;