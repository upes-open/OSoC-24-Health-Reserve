const mongoose = require('mongoose');


const patientSchema = new mongoose.Schema({
    username: { type: String, required: true },
    hospitalName: { type: String },
    dateOfUpload: { type: Date, required: true },
    image: {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true }
    }
})

module.exports = mongoose.model("patient", patientSchema);