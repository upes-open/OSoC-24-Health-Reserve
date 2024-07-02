const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    contact: { type: Number },
    email: { type: String, required: true },
    password: { type: String, required: true },
    license: { type: String, unique: true },
})

module.exports = mongoose.model("user", userSchema);