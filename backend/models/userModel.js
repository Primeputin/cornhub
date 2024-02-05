const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{
        type: String,
        max: 24,
        required: true,
    },
    desc:{
        type: String,
        max: 50,
        required: true,
        default: "",
    },
    password:{
        type: String,
        max: 30,
        required: true,
    },

});

module.exports = mongoose.model("userModel", userSchema);