const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    TransactionID:{
        type: String,
        trim: true,
    },
    Email: {
        type: String,
        trim: true
    },
    firstTime: {
        type: Boolean,
    },
   
}, { collection: 'ForgettenPassword', timestamps: true });

const Admin = mongoose.model('ForgettenPassword', UserSchema);

module.exports = Admin;