const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
    username: { type: String, required: true },
    fullname: { type: String },
    age: { type: Number },
    gender: { type: String },
    role: { type: String },
    contact: { type: Number, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    license: { type: String, required: function () { return this.role === 'Doctor'; } },
})

module.exports = mongoose.model("user", userSchema);