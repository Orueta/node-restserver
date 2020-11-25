require('./config/config');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

//? *********************************************
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//? *********************************************


//* Obtener
app.get('/usuario', function(req, res) {
    res.json('get usuario');
});

//* Insertar
app.post('/usuario', function(req, res) {

    //! Para obtener información enviada desde una aplicación al servidor
    let body = req.body;

    //! Utilizando los status code para responder en caso de que surja un error
    if (body.nombre === undefined) {
        res.status(400).json({
            ok: false,
            mensaje: 'El nombre es necesario'
        });
    } else {
        res.json({
            body
        });

    }

});

//* Actualizar
app.put('/usuario/:id', function(req, res) {

    //! Para obtener el parametro id
    let id = req.params.id;

    res.json({
        id
    });
});

//* Eliminar
app.delete('/usuario', function(req, res) {
    res.json('delete usuario');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});