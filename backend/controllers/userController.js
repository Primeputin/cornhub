const User = require("../models/userModel");
const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const { deleteImageById } = require("./imageController")
const mongoose = require('mongoose');
const { deleteReplies } = require('./commentController');


const bcrypt = require('bcrypt');
const SALTROUNDS = 10;

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

// create user
const createUser = async (req, res) => {
    const { username, password } = req.body;
    try {
        let encrypted_pass = "";
        bcrypt.hash(password, SALTROUNDS, async function (err, hash) {
            encrypted_pass = hash;
            try {
                const user = await User.create({ username: username, password: encrypted_pass });
                res.status(200).json(user);
            } catch (error) {
                // mongoose doesn't catch duplicated errors by default
                if (error.code === 11000) {
                    // MongoDB duplicate key error
                    return res.status(400).json({ error: 'Username already exists' });
                }
                // other errors
                console.error(error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    } catch (error) {
        if (error.name === 'ValidationError') {
            // If the model validation failed, return 400 status code
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

    const {username, password, remember} = req.body
    try
    {   
        const user = await User.findOne({ username });;
        if (!user)
        {
            return res.status(404).json({error: "No such user found :("});
        }

        bcrypt.compare(password, user.password, function(err, result) {
            if (result)
            {
                req.session.user = user._id;
                if (remember)
                {
                    req.session.remember = true;
                }
                else
                {
                    req.session.remember = false;
                }
                console.log(req.session);
                res.status(200).json(user);
            }
            else
            {
                res.status(404).json({error: "No such user found :("});
            }
            
        })
        
    }
    catch(error)
    {
        console.log(error);
    }
}

const logout = (req, res)=>{

    if (req.session) {
        req.session.destroy((err) => {
            if (err) {
                res.status(500).json({ success: false, error: 'Failed to destroy session' });
            } else {
                res.json({ success: true, message: 'Session destroyed successfully' });
            }
        });
    } else {
        res.status(400).json({ success: false, error: 'No active session to destroy' });
    }
}

const checkSession = (req, res)=>{
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json({ message: 'Session expired' });
    }
}

const Session = mongoose.connection.collection('session');

const updateSession = async (req, res) => {
    try {
      // Update session data to set initialAccess to false
      if (req.session && req.session.remember)
      {
        const newExpirationDate = new Date(Date.now() + 1000 * 60 * 60 * 24 * 21);
        await Session.updateOne({ "session.user": req.session.user }, { $set: { expires: newExpirationDate } });
        // req.session.expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        res.status(200).send("Session expiration updated successfully");

      }
      else
      {
        res.status(404).send("No session found");
      }
    } catch (error) {
      console.error('Error updating session data:', error);
      res.status(500).send('Internal server error');
    }
};

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


module.exports = { getUsers, getUser, createUser, checkUser, logout, checkSession, updateSession, deleteUser, updateUser }