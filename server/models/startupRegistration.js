const mongoose = require('mongoose');


const startupRegistrationSchema = new mongoose.Schema({
    
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('StartupRegistration', startupRegistrationSchema);