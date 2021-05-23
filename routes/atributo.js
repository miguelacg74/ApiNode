
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
    res.send(' welcome to page API ATRIBUTO , ' + req.params.username)
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
        idatributo  :req.body.idatributo,
        nombretabla  :req.body.nombretabla, 
        texto :req.body.texto,
        valor :req.body.valor ,
        activo :req.body.activo
    }
    connection.query(sql,atributoObj, error=>{
        if (error) throw error;
            res.send('Atributo creado');
     })
     
})

module.exports = router;