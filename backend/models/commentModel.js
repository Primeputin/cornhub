const mongoose = require("mongoose");
const User = require("./userModel");

const Schema = mongoose.Schema;
const commentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel', 
        required: false, // change this back to true
    },
    comment: {
        type: String,
        required: true,
    },
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
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commentModel',
    }],
});

// This will run every time the object is being saved
commentSchema.pre('save', function (next) {
    this.updatedAt = new Date(); // will the update the updatedAt field every time something is edited
    next(); // Call the next middleware
});

module.exports = mongoose.model("commentModel", commentSchema);