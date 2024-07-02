const mongoose = require('mongoose');


const patientSchema = new mongoose.Schema({
    username: { type: String, required: true },
    hospitalName: { type: String },
    dateOfUpload: { type: Date, required: true },
    image: {
        data: Buffer,
        contentType: String,
        required: true
    }
})

module.exports = mongoose.model("patient", patientSchema);