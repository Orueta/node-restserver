const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const app = express();

// Crear una peticion post para la autenticación
app.post('/login', (req, res) => {

    //! Habilitando la funcionalidad del login
    let body = req.body;

    //? Verificamos si el correo existe
    // para regresar solo 1 usamos findOne
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Verificar si no viene un user de la bd
        if (!usuarioDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: '(Usuario) o contraseña incorrectos'
                }
            });
        }

        // Para tomar la contraseña encryptada y ver si hace match
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contraseña) incorrectos'
                }
            });
        }

        // Generamos el json web token
        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });

    });
});



module.exports = app;