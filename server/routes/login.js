const express = require('express');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

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

// Configuraciones de google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    // La promesa verify nos regresa nuesto objeto personalizado de google
    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}


app.post('/google', async(req, res) => {
    // Primero obtenemos el token
    let token = req.body.idtoken;

    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                err: e
            });
        });

    // Para ir a la bd, hacer validaciones y crear el objeto
    // Primero verificamos si no existe un usuario con el correo ingresado
    Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        // SI sucede un error lo mostramos
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        // Para saber si el usuario ya se registro con el login normal
        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debe de usar su autenticación normal, este correo ya fue registrado'
                    }
                });
            } else {
                // Si ya se registro con google renovamos su token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                return res.json({
                    ok: true,
                    usuari: usuarioDB,
                    token
                });
            }
        } else {
            // Condicion en caso de que sea la primer vez que se estan registrando con google y con un email nuevo
            // SI el usuario no existe en la BD
            let usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save((err, usuarioDB) => {
                // Primero manejamos el error
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };

                // Despues generamos el token
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                // Por ultimo mandamos la respuesta de que si se registro
                return res.json({
                    ok: true,
                    usuario: usuarioDB,
                    token
                });
            });

        }
    });


    // Aqui mandamos a imprimir nuestro objeto personalizado de google
    // res.json({
    //     usuario: googleUser
    // });

});



module.exports = app;