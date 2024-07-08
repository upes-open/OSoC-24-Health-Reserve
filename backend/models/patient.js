const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
    description: { type: String, required: true },
    email: { type: String, required: true },
    doctorName: { type: String },
    hospitalName: { type: String, required: true },
    dateOfUpload: { type: Date, required: true },
    image: {
        data: { type: String, required: true } // Ensure it's a String for hex encoding
        // Ensure it's a String for hex encoding
    }
});


module.exports = mongoose.model('Patient', patientSchema);