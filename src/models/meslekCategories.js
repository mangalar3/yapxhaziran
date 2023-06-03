const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Meslek_Category:{
        type: String,
        trim: true,
    },
    Meslek_SubCategory: {
        type: Array,
        trim: true
    },
   
}, { collection: 'MeslekCategories', timestamps: true });

const Admin = mongoose.model('MeslekCategories', UserSchema);

module.exports = Admin;