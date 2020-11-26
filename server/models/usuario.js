const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Para indicar que roles son validos dentro del schema role
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

// Para hacer el schema del modelo usuario
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        // Para indicarle que roles puede meter al usuario
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//? Para evitar que la contraseña se envie en la respuesta .json (METODO 2)
usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

// Para decirle al schema que use un plugin en particular
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


// para exportar el modelo
module.exports = mongoose.model('Usuario', usuarioSchema);