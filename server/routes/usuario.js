const express = require('express');

const bcrypt = require('bcrypt');
const _ = require('underscore');

const Usuario = require('../models/usuario');

const app = express();

//* Obtener
app.get('/usuario', function(req, res) {
    // Para que el programador pueda decidir desde que usuario se le mostrara
    let desde = req.query.desde || 0;
    desde = Number(desde);

    // Para que el programador puede decidir el limite de usuario que se le mostrara
    let limite = req.query.limite || 5;
    limite = Number(limite);

    // Obtener usuarios de forma paginada
    // para filtrar los resultados de un get tenemos que mandar el nombre de los argumentos dentro de ''
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, conteo) => { // Para retornar el numero de usuarios totales
                res.json({
                    ok: true,
                    usuarios,
                    cuantos: conteo
                });

            })

        })

});

//* Insertar
app.post('/usuario', function(req, res) {
    //! Para obtener información enviada desde una aplicación al servidor
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    // Insertar datos recibidos en la bd
    usuario.save((err, usuarioDB) => {
        if (err) {
            //! Utilizando los status code para responder en caso de que surja un error
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //? Para evitar que la contraseña se envie en la respuesta .json (METODO 1)
        // usuarioDB.password = null;


        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

//* Actualizar
app.put('/usuario/:id', function(req, res) {

    //! Para obtener el parametro id
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });

    });

});

//* Eliminar
app.delete('/usuario/:id', function(req, res) {

    let id = req.params.id;

    // Para eliminar no fisicamente el item (cambiar el estado)
    let cambiaEstado = {
        estado: false
    };

    Usuario.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (usuarioBorrado === null) {
            return res.status(400).json({
                ok: false,
                error: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });

    });


    // Para eliminar fisicamente el item (que deje de existir)
    // Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
    //     if (err) {
    //         return res.status(400).json({
    //             ok: false,
    //             err
    //         });
    //     };

    //     if (usuarioBorrado === null) {
    //         return res.status(400).json({
    //             ok: false,
    //             error: {
    //                 message: 'Usuario no encontrado'
    //             }
    //         });
    //     }

    //     res.json({
    //         ok: true,
    //         usuario: usuarioBorrado
    //     });

    // });



});


module.exports = app;