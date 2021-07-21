const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, //On utilise unique pour éviter que deux personnes aient la même adresse email.
    password: { type: String, required: true },
})

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model('User', userSchema);