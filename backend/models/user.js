const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    contact: Number,
    email: { type: String, required: true },
    password: { type: String, required: true },
    license: { type: Number, unique: true },
})

module.exports = mongoose.model("user", userSchema);