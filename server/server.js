require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const bodyParser = require('body-parser');

const app = express();

//? *********************************************
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

//? *********************************************

//todo Habilitar la carpeta public para que se pueda acceder desde cualquier lugar
app.use(express.static(path.resolve(__dirname, '../public')));


//! Configuración global de rutas
app.use(require('./routes/index'));

//! Conexion a la base de datos de mongo
mongoose.connect(process.env.URLDB, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
}, (err) => {
    if (err) {
        throw err;

    }
    console.log('Base de Datos online');

});

//! Configuración para saber si se esta escuchando el puerto
app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto', process.env.PORT);
});