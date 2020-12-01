const express = require('express');

let { verificaToken, verificaAmin_Role } = require('../middlewares/autenticacion');

let app = express();

const Categoria = require('../models/categoria');


// Mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        // sort nos permite realizar un orden alfabeticamente
        .sort('descripcion')
        //Populate permite saber que informacion de tablas se esta solucionando y posteriormente cargar informacion
        .populate('usuario', 'nombre email')
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categorias
            });

        });

});

// Mostrar una categoria por ID
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'El ID no es correcto'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// Crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {
    // Para optener lo que se desea insertar
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Condicion para evaluar si se creo la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// Actualizar una categoria
app.put('/categoria/:id', verificaToken, (req, res) => {
    // Primero obtenemos el id
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    // Funcion que busca por id y lo actualiza
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // mostramos la respuesta con la nueva categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });


});

// Borrar una categoria (Eliminado fisico)
app.delete('/categoria/:id', [verificaToken, verificaAmin_Role], (req, res) => {
    // Solo un administrador puede borrar categorias

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        // Condicion para evaluar si se creo la categoria
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    });

});

module.exports = app;