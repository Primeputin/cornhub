const mongoose = require("mongoose");
const User = require("./userModel");

const Schema = mongoose.Schema;
const commentSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel', 
        required: true, 
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
        immutable: false,
        default: ()=>Date.now(),
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commentModel',
    }],
});

commentSchema.pre('findOneAndUpdate', function(next) {
    this._update.updatedAt = new Date();
    next();
});

module.exports = mongoose.model("commentModel", commentSchema);