const mongoose = require("mongoose");
const User = require("./userModel");
const Comment = require("./commentModel");
const Image = require("./imageModel");

const Schema = mongoose.Schema;
const postSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel', 
        required: true, 
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
    postedImages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'imageModel',
        required: false,
    }],
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
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'commentModel',
    }],
    likes: {
        type: Number,
        required: true,
    },
    dislikes: {
        type: Number,
        required: true,
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel', 
    }],
    disLikedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'userModel', 
    }],
    
});

postSchema.pre('findOneAndUpdate', function(next) {
    const update = this.getUpdate();

    // Fix for the like, dislike and comment not saying "edited on"
    if (update.hasOwnProperty('comments') && !(update.hasOwnProperty('likes')) && !(update.hasOwnProperty('dislikes'))) { 
        update.updatedAt = new Date();
    }
    // Proceed to the next middleware
    next();
});



module.exports = mongoose.model("postModel", postSchema);