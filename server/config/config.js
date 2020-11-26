// ========================
//  Puerto
// =========================
process.env.PORT = process.env.PORT || 3000;

// ========================
//  Entorno
//=========================
//* Para saber si estoy en desarrollo o en producción
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ========================
//  Bases de datos
//=========================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://Tatzu:Quuzz2q2dlLDLwJl@cluster0.6qkrb.mongodb.net/cafe';
}
process.env.URLDB = urlDB;