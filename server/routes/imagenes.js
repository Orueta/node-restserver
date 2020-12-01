// ! Servicio para mostrar las imagenes

const express = require('express');

const fs = require('fs');
const path = require('path');

const { verificaTokenImg } = require('../middlewares/autenticacion');

let app = express();


// Ruta unica que servira para desplegar información
app.get('/imagen/:tipo/:img', verificaTokenImg, (req, res) => {

    let tipo = req.params.tipo;
    let img = req.params.img;

    // Verficamos que el path de la imagen exita, si existe mostramos la imagen si no mostramos la no-image.jpg
    let pathImgen = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    if (fs.existsSync(pathImgen)) {
        res.sendFile(pathImgen);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }




});


module.exports = app;