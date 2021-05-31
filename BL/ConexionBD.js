const mysql=require('mysql');
class Conexion {
  constructor() {
    /*this.connection = mysql.createConnection({
      host     : 'localhost',
      port: 3306,
      user     : 'aplicacion',
      password : 'Local_1234',
      database : 'aplicacion'
    });
   */
    this.connection = mysql.createConnection({
      host     : 'localhost',
      port: 3306,
      user     : 'arquitectura',
      password : 'Local_1234',
      database : 'arquitectura'
    });
  }
   conexion() {
    return connection; 
  }
  AbrirConexion() {
    this.connection.connect(function(err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
      //console.log('connected as id ' + this.connection.threadId);
    });
   return this.connection;
  }
  AbrirConexionPool() {
    this.pool = mysql.createPool({ 
      host     : 'localhost',
      port: 3306,
      user     : 'arquitectura',
      password : 'Local_1234',
      database : 'arquitectura'
     });
   return this.pool;
  }
  getResult(sql,pool){
    return new Promise(function(resolve,reject){
      pool.query(sql, function(err, result){
        if(err){
          reject(err)
        }else{
          resolve(result)
        }
      })
    })
  }
};
module.exports = Conexion;