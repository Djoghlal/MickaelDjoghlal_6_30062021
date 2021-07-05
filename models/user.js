const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true }, //On utilise unique pour éviter que deux personnes aient la même adresse email.
    password: { type: String, required: true },
})

module.exports = mongoose.model('User', userSchema);