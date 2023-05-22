const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const Conexion = require("../BL/ConexionBD.js");
const CrudGenericoBL = require("../BL/CrudGenericoBL.js");
var bd = new Conexion();
var connection = bd.AbrirConexion();
var crudGenerico = new CrudGenericoBL(connection);
const PORT = process.env.PORT || 3050;
const app = express();
app.use(bodyParser.json());
//los endpoints de los cruds que se necesitaran consumir
router.route('/').get((req, res) => {
    res.send('bienvenido a api ACCOUNT');
})
router.route('/prueba').get((req, res) => {
    res.send('bienvenido a api ACCOUNT prueba');
})



router.route('/loginold').post(async (req, res) => {
   respuesta = {
                "status": "success",
                "url": "Home/Index",
                "UserDisplayname": "",
                "Idusuario": ""
            }
            res.json(respuesta);

    });

router.route('/login').post(async (req, res) => {

    var pool = await bd.AbrirConexionPool();
    var respuesta;
    var sql;
     console.log(req);
    sql = `SELECT * FROM USUARIO WHERE LOGIN='${req.body.LOGIN}' and PASSWORD='${req.body.PASSWORD}'`
   
    pool.query(sql, async function (error, result) {
        if (error) throw error;
        if (result.length == 0) {
            respuesta = {
                "status": "nosuccess",
                "url": "",
                "UserDisplayname": sql,
                "Idusuario": ""
            }
            console.log(respuesta);
            res.json(respuesta);
        }


        if (result.length > 0) {
            console.log(result[0])
            respuesta = {
                "status": "success",
                "url": "Home/Index",
                "UserDisplayname": result[0]["NOMBRE"],
                "Idusuario": result[0]["IDUSUARIO"]
            }
            res.json(respuesta);
        }

    });




})
router.route('/LogOffAngular', ).post((req, res) => {
    crudGenerico.Buscar(req, res, 'prueba', '*');
})
router.route('/CudRolesUsuario').post((req, res) => {
    crudGenerico.Buscar(req, res, 'prueba', '*');
})
router.route('/ObtenerUsuarios').post((req, res) => {

    var filtro = '';
    var listado;
    var pool = bd.AbrirConexionPool();
    if (req.body.perfil != undefined && req.body.perfil != '') {
        filtro = req.body.perfil;
    }
    var login = req.body.USERNAME;
    var password = req.body.PASSWORD;
    var idaplicacion = req.body.IDAPLICACION;
    var idusuario = req.body.IDUSUARIO;
    var filtro = "";
    console.log(req.body)
    if (idaplicacion != 0 && idusuario == 0) {
        filtro = ` WHERE AU.IDAPLICACION=${idaplicacion}`
    }
    if ((idaplicacion == '' || idaplicacion == 0 || idaplicacion == null) && idusuario != 0 && idusuario != undefined) {
        filtro = ` WHERE A.IDUSUARIO=${idusuario}`;
    }
    if (idaplicacion != 0 && idaplicacion != '' && idaplicacion != null && idusuario != 0) {
        filtro = ` WHERE A.IDUSUARIO=${idusuario} AND AU.IDAPLICACION=${idaplicacion}`;
    }
    if (login == '' || password == '' || login == undefined || password == undefined) {
        var sql = `Select A.IDUSUARIO,
        A.NOMBRE,
        A.CARGO,
        A.LOGIN, 
        A.PASSWORD,
        A.EMAIL, A.ACTIVO 
        from USUARIO A LEFT JOIN APLICACION_USUARIO AU ON 
        AU.IDUSUARIO=A.IDUSUARIO ${filtro} 
        GROUP BY A.IDUSUARIO,A.NOMBRE,A.CARGO,A.LOGIN, A.PASSWORD,A.EMAIL, A.ACTIVO `;
        console.log(sql)
        listado = [];
        var l = [];
        /*ejecuta la primera consulta asincrona */
        pool.query(sql, async function (error, usuarios) {
            if (error) throw error;

            if (usuarios.length == 0) {

                let resultado = {
                    'status': "noSuccess",
                    'url': "",
                    "UserDisplayName": ""
                };
                res.json(resultado);
            }

            if (usuarios.length > 0) {
                for (var i = 0; i < usuarios.length; i++) {
                    var sql_usuarioperfil = `Select distinct B.IDROL AS ID_PERFIL,B.IDROL AS CODIGO_PERFIL,
            B.NOMBRE AS NOMBRE_PERFIL,B.DESCRIPCION,B.IDAPLICACION 
            from USUARIO A LEFT JOIN ROL_USUARIO RU ON RU.IDUSUARIO=A.IDUSUARIO 
            INNER JOIN ROL B ON RU.IDROL=B.IDROL WHERE A.IDUSUARIO='${usuarios[i].IDUSUARIO}'`;
                    var usuarioperfil = await bd.getResult(sql_usuarioperfil, pool)
                    var sql_usuarioaplicacion = `Select B.IDAPLICACION AS IDAPLICACION,B.APLICACION 
            from USUARIO A LEFT JOIN APLICACION_USUARIO RU ON RU.IDUSUARIO=A.IDUSUARIO 
            INNER JOIN APLICACION B ON RU.IDAPLICACION=B.IDAPLICACION 
            WHERE A.IDUSUARIO='${usuarios[i].IDUSUARIO}'`;
                    var usuarioaplicacion = await bd.getResult(sql_usuarioaplicacion, pool)
                    const elemento = {
                        IDUSUARIO: usuarios[i].IDUSUARIO,
                        NOMBRE: usuarios[i].NOMBRE,
                        CARGO: usuarios[i].CARGO,
                        LOGIN: usuarios[i].LOGIN,
                        ACTIVO: usuarios[i].ACTIVO,
                        PASSWORD: usuarios[i].PASSWORD,
                        EMAIL: usuarios[i].EMAIL,
                        PERFIL_ARRAY: usuarioperfil,
                        APLICACION_ARRAY: usuarioaplicacion
                    };
                    listado.push(elemento);
                }
                pool.end() /*cierra el pool de conexion*/
                console.log('okkk')
                if (listado != null) {
                    let resultado = {
                        'status': "Success",
                        'url': "Home/Index",
                        "data": listado
                    };
                    res.json(resultado);
                }

            }



        })


    }

});

router.route('/update/:id').put((req, res) => {
    const {
        id
    } = req.params;
    const {
        nombre,
        apellido
    } = req.body;
    const sql = `UPDATE  prueba SET nombre='${nombre}', apellido='${apellido}' where id=${id}`;
    connection.query(sql, error => {
        if (error) throw error;
        res.send('customer updated');
    })
});

router.route('/CudUsuario').post((req, res) => {
  var pagina_array = req.body.PAGINA_ARRAY;
  
  var perfil_array =  req.body.PERFIL_ARRAY;
  var aplicacion_array = req.body.APLICACION_ARRAY;
console.log(req.body)



  if (req.body.IDUSUARIO != '') {
    const data = [
	req.body.IDROL,
	req.body.NOMBRE,
	req.body.APELLIDO,
	req.body.LOGIN,
	req.body.IDTIPODOCUMENTO,
	req.body.NUMERODOCUMENTO,
	req.body.TELEFONO,
	req.body.PASSWORD,
	req.body.EMAIL,
	req.body.CARGO,
	req.body.FECHACREACION,
	req.body.ACTIVO,
	req.body.IDUSUARIO
    ]
    
    let sql = `UPDATE USUARIO
        SET 
        IDROL=?,
	NOMBRE=?,
	APELLIDO=?,
	LOGIN=?,
	IDTIPODOCUMENTO=?,
	NUMERODOCUMENTO=?,
	TELEFONO=?,
	PASSWORD=?,
	EMAIL=?,
	CARGO=?,
	FECHACREACION=?,
	ACTIVO=? 
	where IDUSUARIO=?`;
        
  
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      console.log('Rows affected:', results.affectedRows);
    res.json('ok');
    });
  } else {
    const sql = 'INSERT INTO USUARIO SET ?';
    const data = {
        NOMBRE:req.body.NOMBRE,
	CARGO:req.body.CARGO,
	LOGIN:req.body.LOGIN,
	IDROL:req.body.IDROL,
 	EMAIL:req.body.EMAIL,
	IDAPLICACION:req.body.IDAPLICACION,
	PASSWORD:req.body.PASSWORD,
	ACTIVO:req.body.ACTIVO,
	IDUSUARIO:req.body.IDUSUARIO
       }
   
    connection.query(sql, data, (error, results, fields) => {
      if (error) {
        return console.error(error.message);
      }
      console.log('Rows affected:', results.affectedRows);
    });
     res.json('ok');
  }
})

module.exports = router;
