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
router.route('/login').post((req, res) => {
    var resultado;
    var sql;
    sql = `SELECT * FROM USUARIO WHERE LOGIN='${req.body.login}' and PASSWORD='${req.body.password}'`
    resultado = connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0) {
            var resultado = {
                "status": "success",
                "url": "Home/Index",
                "UserDisplayname": results[0]["NOMBRE"],
                "Idusuario": results[0]["IDUSUARIO"]
            }
            res.json(resultado);
        } else {
            var resultado = {
                "status": "nosuccess",
                "url": "",
                "UserDisplayname": "",
                "Idusuario": ""
            }
            res.json(resultado);
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
    var pool = bd.AbrirConexionPool();
    if (req.body.perfil != undefined && req.body.perfil != '') {
        filtro = req.body.perfil;
    }
    var login = req.body.UserName;
    var password = req.body.Password;
    var idaplicacion = req.body.IDAPLICACION;
    var idusuario = req.body.IDUSUARIO;
    var filtro = "";
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
                let resultado = {
                    'status': "Success",
                    'url': "Home/Index",
                    "data": listado
                };
                res.json(resultado);
            } else {
                let resultado = {
                    'status': "noSuccess",
                    'url': "",
                    "UserDisplayName": ""
                };
                res.json(resultado);
            }
        });
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
    var idusuario = req.body.IDUSUARIO;
    var nombre = req.body.NOMBRE;
    var cargo = req.body.CARGO;
    var login = req.body.LOGIN;
    var idrol = req.body.IDROL;
    var email = req.body.EMAIL;
    var idaplicacion = req.body.IDAPLICACION;
    var password = req.body.PASSWORD;
    var activo = req.body.ACTIVO;
    var perfil_array = req.body.PERFIL_ARRAY;
    var aplicacion_array = req.body.APLICACION_ARRAY;
    if (req.body.IDUSUARIO = '') {
        const data = [
            req.body.NOMBRE,
            req.body.CARGO,
            req.body.LOGIN,
            req.body.IDROL,
            req.body.EMAIL,
            req.body.IDAPLICACION,
            req.body.PASSWORD,
            req.body.ACTIVO,
            req.body.IDUSUARIO
        ]
        let sql = `UPDATE USUARIO
               SET NOMBRE= ?,
               CARGO=?,
               LOGIN=?,
               IDROL=?,
               EMAIL=?
               IDAPLICACION=?,
               PASSWORD=?,
               ACTIVO=?
               WHERE IDUSUARIO = ?`;
        connection.query(sql, data, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
            console.log('Rows affected:', results.affectedRows);
        });
    } else {
        const sql = 'INSERT INTO USUARIO SET ?';
        const data = {
            NOMBE: req.body.NOMBRE,
            CARGO: req.body.CARGO,
            LOGIN: req.body.LOGIN,
            IDROL: req.body.IDROL,
            EMAIL: req.body.EMAIL,
            IDAPLICACION: req.body.IDAPLICACION,
            PASSWORD: req.body.PASSWORD,
            ACTIVO: req.body.ACTIVO,
            IDUSUARIO: req.body.IDUSUARIO
        }
        connection.query(sql, data, (error, results, fields) => {
            if (error) {
                return console.error(error.message);
            }
            idusuario = results.insertId
            console.log('Rows affected:', results.affectedRows);
        });
    }
    if (idusuario != '') {
        var sql_delete = `delete from APLICACION_USUARIO 
        where IDUSUARIO=${idusuario}) AND IDAPLICACION=${idaplicacion})`;
        connection.query(sql_delete, (error) => {
            if (error) {
                return console.error(error.message);
            }
        });
        aplicacion_array.forEach(function (value) {
            var sql_aplicacion_usuario = 'INSERT INTO APLICACION_USUARIO SET ';
            const data_aplicacion_usuario = {
                IDAPLICACION: value.IDAPLICACION,
                IDUSUARIO: req.body.IDUSUARIO
            }
            connection.query(sql_aplicacion_usuario, data_aplicacion_usuario, (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                idusuario = results.insertId
                console.log('Rows affected:', results.affectedRows);
            });
        });
        var sql_delete_rol_usuario = `delete from ROL_USUARIO  
        where IDUSUARIO=${idusuario}) AND IDAPLICACION=${idaplicacion})`;
        connection.query(sql_delete_rol_usuario, (error) => {
            if (error) {
                return console.error(error.message);
            }
        });
        perfil_array.forEach(function (value) {
            var sql_aplicacion_usuario = 'INSERT INTO ROL_USUARIO SET ';
            const data_rol_aplicacion_usuario = {
                IDROL: value.IDROL,
                IDAPLICACION: value.IDAPLICACION,
                IDUSUARIO: req.body.IDUSUARIO
            }
            connection.query(sql_aplicacion_usuario, data_rol_aplicacion_usuario, (error, results, fields) => {
                if (error) {
                    return console.error(error.message);
                }
                idusuario = results.insertId
                console.log('Rows affected:', results.affectedRows);
            });
        });
        var result = {
            'status': "Success",
            "msg": "OK"
        };
        res.json(result);
    } else {
        results = {
            'status': "NoSuccess",
            "msg": "ERROR"
        };
        res.json(results);
    }
});
module.exports = router;