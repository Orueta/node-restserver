const express = require('express');

const app = express();

//! Rutas de la api
app.use(require('./usuario'));
app.use(require('./login'));



module.exports = app;