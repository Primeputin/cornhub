const mongoose = require("mongoose");
const Image = require("./imageModel");

const Schema = mongoose.Schema;
const userSchema = new Schema({
    username:{
        type: String,
        max: 24,
        required: true,
        unique: true,
    },
    desc:{
        type: String,
        max: 50,
        default: ()=>"",
    },
    password:{
        type: String,
        max: 30,
        required: true,
    },
    profpic: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'imageModel', 
        required: false, 
    },

});

module.exports = mongoose.model("userModel", userSchema);