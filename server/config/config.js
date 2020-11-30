// ========================
//  Puerto
// =========================
//* Para que alterne entre el puerto local y el de heroku
process.env.PORT = process.env.PORT || 3000;

// ========================
//  Entorno
//=========================
//* Para saber si estoy en desarrollo o en producción
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================
//  Vencimiento del token
//=========================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ========================
//  SEED de autenticación
//=========================
// Creamos la variable de entorno en heroku SEED
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ========================
//  Bases de datos
//=========================
//* Para que alterne entre la bases de datos local y la de mongodb atlas
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

// ========================
//  Google client
//=========================
process.env.CLIENT_ID = process.env.CLIENT_ID || '79817631814-6ps9pd5m7u4r3b0a9abl0m1qhtit05ht.apps.googleusercontent.com';