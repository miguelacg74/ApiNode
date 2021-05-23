const mysql=require('mysql');
class Conexion {
 

  constructor() {
    this.connection = mysql.createConnection({
      host     : 'localhost',
      port: 3306,
      user     : 'aplicacion',
      password : 'Local_1234',
      database : 'aplicacion'
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
};

module.exports = Conexion;