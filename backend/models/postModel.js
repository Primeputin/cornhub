const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const postSchema = new Schema({
    title:{
        type: String,
        max: 30,
        require: true,
    },
    desc:{
        type: String,
        max: 100,
        require: true,
    },
    createdAt:{
        type: Date,
        require: true,
        immutable: true,
        default: ()=>Date.now(),
    },
    updatedAt:{
        type: Date,
        require: true,
        immutable: true,
        default: ()=>Date.now(),
    }
});

module.exports = mongoose.model("postModel", postSchema);