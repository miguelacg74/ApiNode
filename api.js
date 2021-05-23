const express= require('express');
const bodyParser=require('body-parser');
const Conexion=require("./BL/ConexionBD.js");
const CrudGenericoBL=require("./BL/CrudGenericoBL.js");


var bd= new Conexion();
var connection = bd.AbrirConexion();

var crudGenerico= new CrudGenericoBL(connection);


const PORT = process.env.PORT || 3050;
const app=express();

app.use(bodyParser.json());

 //los endpoints de los cruds que se necesitaran consumir

 app.get('/',(req,res)=>{

    res.send('welcome to my api');

 })
 app.get('/customers',(req,res)=>{
  crudGenerico.Buscar( req,res,'prueba','*');
 })

 app.get('/customers/:id',(req,res)=>{
    const { id } = req.params;
    crudGenerico.Buscar( req,res,'prueba','*');
 });

 app.post('/add',(req,res)=>{

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
 
 app.put('/update/:id',(req,res)=>{
    const {id}=req.params;
    const {nombre,apellido}=req.body;
    const sql =`UPDATE  prueba SET nombre='${nombre}', apellido='${apellido}' where id=${id}`;
    connection.query(sql, error=>{
          if (error) throw error;
              res.send('customer updated');
       })
   });

   app.delete('/delete/:id',(req,res)=>{
    const { id } = req.params;
    crudGenerico.Eliminar( req,res,'prueba');
   });

app.listen(PORT,()  => console.log(`SERVER RUNNING ON PORT ${PORT}`));

//connection.end();
