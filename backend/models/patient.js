const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    description: { type: String, required: true },
    email: { type: String, required: true },
    doctorName: { type: String },
    hospitalName: { type: String, required: true },
    dateOfUpload: { type: Date, required: true },
    image: {
        data: { type: Buffer, required: true },
        contentType: { type: String, required: true }
    }
});

module.exports = mongoose.model('Patient', patientSchema);