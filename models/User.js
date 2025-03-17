const mongoose = require('mongoose');

//userSchema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true //le nom est obligatoire
    },
    email:{
        type: String,
        required: true,
        unique: true
    }
});

const User = mongoose.model("User", userSchema)

module.exports = User;