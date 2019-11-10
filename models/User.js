//Creating model for Users 
//to work with mongoDB database
const mongoose = require('mongoose');

//to store attributes that user will hold

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,

    },
    avatar: {
        type:String
    },
    date: {
        type:Date,
        default: Date.now
    }

});

module.exports = User = mongoose.model('user',UserSchema);

