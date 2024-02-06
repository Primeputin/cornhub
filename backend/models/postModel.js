const mongoose = require("mongoose");
const User = require("./userModel");
const Comment = require("./commentModel");

const Schema = mongoose.Schema;
const postSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel', 
        required: false, // change this back to true
    },
    title:{
        type: String,
        max: 30,
        required: true,
    },
    desc:{
        type: String,
        max: 100,
        required: true,
    },
    tags: [String],
    createdAt:{
        type: Date,
        required: true,
        immutable: true,
        default: ()=>Date.now(),
    },
    updatedAt:{
        type: Date,
        required: true,
        immutable: true,
        default: ()=>Date.now(),
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commentModel',
    }],
});

module.exports = mongoose.model("postModel", postSchema);