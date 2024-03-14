const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const { deleteImageById } = require("./imageController")
const mongoose = require('mongoose');
const { deleteReplies } = require('./commentController');


// get all users
const getUsers = async (req, res)=>{

    const users = await User.find({});
    res.status(200).json(users);
}

// get a user
const getUser = async (req, res)=>{
    const { id } = req.params
    // checks if the obj id is valid before proceeind to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error: "No such user found :("});
    }

    try {
        const user = await User.findById(id).populate('profpic');
    
        if (!user) {
            return res.status(404).json({ error: "No such user found :(" });
        }
    
        return res.status(200).json(user);
    } catch (error) {
        // Handle any unexpected errors
        console.error("Error retrieving user:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }

}

// create a user
const createUser =  async (req, res)=>{

    const {username, password} = req.body
    try
    {   
        const user = await User.create({username, password});
        res.status(200).json(user);
    }
    catch(error)
    {
        if (error.name === 'ValidationError') {
            // If the model invalidation happened, return 400 status code
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ error: 'Validation failed', details: validationErrors });
        }
        // For other types of errors, log the error and return a 500 status code
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    
    }
}

// check if valid user
const checkUser =  async (req, res)=>{

    const {username, password} = req.body
    try
    {   
        const user = await User.findOne({ username, password });
        if (!user)
        {
            return res.status(404).json({error: "No such user found :("});
        }
        res.status(200).json(user);
    }
    catch(error)
    {
        console.log(error);
    }
}

// delete a user
const deleteUser = async (req, res)=>{
    const { id } = req.params
    // checks if the obj id is valid before proceeind to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error: "No such user found :("});
    }

    try {
        // Find the user and populate the imageModel field
        const user = await User.findById(id).populate('profpic');

        if (!user) {
            return res.status(404).json({ error: "No such user found :(" });
        }

        //remove from likedBy from every post (also update the counter to be -1)(done)
        for(let i = 0; i < user.likedPosts.length; i++){
            const postTemp = await Post.findById(user.likedPosts[i]);
            let updatedLikes = postTemp.likes;
            updatedLikes = updatedLikes - 1;

            await Post.findOneAndUpdate({_id: user.likedPosts[i]}, { $pull: { likedBy: id }, $set: { likes: updatedLikes }});
        }

        //remove from disLikedBy from every post (also update the counter to be -1)(done)
        for(let i = 0; i < user.dislikedPosts.length; i++){
            const postTemp = await Post.findById(user.dislikedPosts[i]);
            let updatedDislikes = postTemp.dislikes;
            updatedDislikes = updatedDislikes - 1;

            await Post.findOneAndUpdate({_id: user.dislikedPosts[i]}, { $pull: { disLikedBy: id }, $set: { dislikes: updatedDislikes }});
        }
        //delete every comment theyve made
        deleteAllUserComments(id);

        //delete every post theyve made(done)
        deleteAllUserPosts(id);

        // If the user has an imageModel, delete it first
        if (user.profpic) {
            await deleteImageById(user.profpic._id);
        }

        // Delete the user
        await User.findByIdAndDelete(id);

        res.status(200).json({ message: "User and associated image deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

async function deleteAllUserComments(userId){
    try {
        const id = userId;

        // Use the Comment model to find all comments made by the user with the given id. The comments are sorted by the createdAt field in descending order (most recent first).
        const comments = await Comment.find({user: id}).populate({
            path: 'user',
            populate: { path: 'profpic' }
        }).sort({ createdAt: -1 });

        for(let i = 0; i < comments.length; i++){

            deleteReplies(comments[i]._id);
        }


    } catch (error) {
        // If there's an error at any point in the try block, it's caught here. The error is logged to the console.
        console.error("Error while fetching comments:", error);

    }
}

async function deletePost(postId){
    const id = postId;
    // checks if the obj id is valid before proceeind to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return;
    }

    try {

        // Find the post and populate the imageModel field
        const post = await Post.findById(id).populate('postedImages');
       
        await User.updateMany({}, { $pull: { likedPosts: id } });
        await User.updateMany({}, { $pull: { dislikedPosts: id } });

        for(let i = 0; i < post.comments.length; i++){
            deleteReplies(post.comments[i]);
        }

        if (!post) {
            return;
        }

        // If the post has an imageModel, delete it first
        if (post.postedImages) {
            for (const image of post.postedImages)
            {
                await deleteImageById(image._id);
            }
        }

        // Delete the post
        await Post.findByIdAndDelete(id);

    } catch (error) {
        console.error("Error deleting post:", error);
    }
}

async function deleteAllUserPosts(userId){
    const id =  userId;
    const posts = await Post.find({user: id}).populate({
        path: 'user',
        populate: { path: 'profpic' }
    }).populate('postedImages').sort({createdAt: -1});
    for(let i = 0; i < posts.length; i++){
        deletePost(posts[i]._id);
    }
}
// update a user
const updateUser = async (req, res)=>{
    const { id } = req.params
    // checks if the obj id is valid before proceeind to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error: "No such user found :("});
    }

    const user = await User.findOneAndUpdate({_id: id}, {...req.body}).populate("profpic");

    if (!user)
    {
        return res.status(404).json({error: "No such user found :("});
    }
    res.status(200).json(user);
}


module.exports = { getUsers, getUser, createUser, checkUser, deleteUser, updateUser }