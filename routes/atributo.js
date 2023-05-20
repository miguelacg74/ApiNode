
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
    res.send('Bienvenido a la API ATRIBUTO ');
})
router.route('/ObtenerAtributo/:idAtributo').post((req,res)=>{
  crudGenerico.Buscar(req,res,'ATRIBUTO','*','IDATRIBUTO')
})
router.route('/ObtenerAtributo').get((req,res)=>{
  crudGenerico.Buscar(req,res,'ATRIBUTO','*')
})
router.route('/CudAtributo')
    .post((req,res)=>{
     const sql ='INSERT INTO ATRIBUTO SET ?';
  const atributoObj={
        idatributo  :req.body.IDATRIBUTO,
        nombretabla  :req.body.NOMBRETABLA, 
        texto :req.body.TEXTO,
        valor :req.body.VALOR ,
        activo :req.body.ACTIVO
    }
    connection.query(sql,atributoObj, error=>{
        if (error) throw error;
            res.send('Atributo creado');
     })
})
module.exports = router;
