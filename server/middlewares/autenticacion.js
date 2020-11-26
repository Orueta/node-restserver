const jwt = require('jsonwebtoken');

// ================================
//  Verificar Token
//=================================

// Funcion que verificara el token
let verificaToken = (req, res, next) => {
    // Para leer el header que viene con el atributo token
    let token = req.get('token');

    // Comprobar que el token es valido
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();

    });

};

//! ESTO NO LO COLOQUES EN LA API MT ES PARA LOS ROLES DE USUARIO
let verificaAmin_Role = (req, res, next) => {
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};

module.exports = {
    verificaToken,
    verificaAmin_Role
}