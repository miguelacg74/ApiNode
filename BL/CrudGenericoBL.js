const mysql=require('mysql');
const conexionBD=require('./ConexionBD.js');

class CrudGenericoBL {
 

  constructor(conexionBD) {
    this.connection = conexionBD;
    
   
  }




   Buscar(req,res,tabla,campos,campocriterio) {
    var resultado;
    var {id}=req.params;
    var sql;
    console.log(id)
    if (id===undefined){

      sql=`SELECT ${campos} FROM ${tabla}`
    }
    if (id!=undefined){

      sql=`SELECT ${campos} FROM ${tabla} WHERE ${campocriterio}=${id}`
    }
    
    resultado=this.connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        if (results.length>0){
          res.json(results);
        } 
        else{ return res.send('no hay resultados');}
      });
  }

  Eliminar(req,res,tabla) {
    var {id}=req.params;
    var sql;
    console.log(id)
    if (id!=undefined){

      sql=`DELETE FROM ${tabla} WHERE id=${id}`
    }
    
    this.connection.query(sql, error=>{
      if (error) throw error;
          res.send('customer DELETE');
      });
  }


};

module.exports = CrudGenericoBL;