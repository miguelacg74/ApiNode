
const express= require('express');
const router= express.Router()
const bodyParser=require('body-parser');
const Conexion=require("../BL/ConexionBD.js");
const CrudGenericoBL=require("../BL/CrudGenericoBL.js");


var bd= new Conexion();
var connection = bd.AbrirConexion();

var crudGenerico= new CrudGenericoBL(connection);


const PORT = process.env.PORT || 3050;
const app=express();

app.use(bodyParser.json());

 //los endpoints de los cruds que se necesitaran consumir

 router.route('/').get((req,res)=>{

    res.send('welcome to my api ACCOUNT');

 })
 
 router.route('/ObtenerAtributo/:login/:password').post((req,res)=>{
    const {usuario,password}=req.params;
    var resultado;
    var sql;
    sql=`SELECT * FROM USUARIO WHERE LOGIN='${req.params.login}' and PASSWORD='${req.params.password}'`
    resultado=connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        if (results.length>0){
            var resultado={"status":"success","url":"Home/Index","UserDisplayname": results[0]["NOMBRE"],"Idusuario": results[0]["IDUSUARIO"]}
          res.json(resultado);
        } 
        else{ 

            var resultado={"status":"nosuccess","url":"","UserDisplayname": "","Idusuario": ""}
            res.json(resultado);
        }
      });
 })

 

 router.route('/LogOffAngular',).post((req,res)=>{
    crudGenerico.Buscar( req,res,'prueba','*');
   })
  
   router.route('/CudRolesUsuario').post((req,res)=>{
    crudGenerico.Buscar( req,res,'prueba','*');
   })

 

   router.route('/ObtenerUsuarios').post((req,res)=>{

  const sql ='INSERT INTO prueba SET ?';
  const cunstomerObj={
        id: req.body.id,
        nombre  : req.body.nombre,
        apellido: req.body.apellido
    }
    connection.query(sql,cunstomerObj, error=>{
        if (error) throw error;
            res.send('customer created');
     })
 });
 
 router.route('/update/:id').put((req,res)=>{
    const {id}=req.params;
    const {nombre,apellido}=req.body;
    const sql =`UPDATE  prueba SET nombre='${nombre}', apellido='${apellido}' where id=${id}`;
    connection.query(sql, error=>{
          if (error) throw error;
              res.send('customer updated');
       })
   });

   router.route('/CudUsuario/:id').post((req,res)=>{
    const { id } = req.params;
    crudGenerico.Eliminar( req,res,'prueba');
   });



   module.exports = router;
