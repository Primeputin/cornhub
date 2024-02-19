const Post = require("../models/postModel");
const mongoose = require('mongoose');


// get all posts
const getPosts = async (req, res)=>{

    const posts = await Post.find({}).populate({
        path: 'user',
        populate: { path: 'profpic' }
    }).populate('postedImages').sort({createdAt: -1});
    res.status(200).json(posts);
}

// get a post
const getPost = async (req, res)=>{
    const { id } = req.params
    // checks if the obj id is valid before proceeind to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error: "No such post found :("});
    }

    const post = await Post.findById(id);

    if (!post)
    {
        return res.status(404).json({error: "No such post found :("});
    }
    res.status(200).json(post);
}

// create a post
const createPost =  async (req, res)=>{
    try
    {  
        const {user, title, desc, tags, postedImages} = req.body 

        const post = await Post.create({user, title, desc, tags, postedImages});

        res.status(200).json(post);
    }
    catch(error)
    {
        console.log(error);
    }
}

// delete a post
const deletePost = async (req, res)=>{
    const { id } = req.params
    // checks if the obj id is valid before proceeind to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error: "No such post found :("});
    }

    const post = await Post.findOneAndDelete({_id: id});

    if (!post)
    {
        return res.status(404).json({error: "No such post found :("});
    }
    res.status(200).json(post);
}

// update a post
const updatePost = async (req, res)=>{
    const { id } = req.params
    // checks if the obj id is valid before proceeind to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error: "No such post found :("});
    }

    const post = await Post.findOneAndUpdate({_id: id}, {...req.body});

    if (!post)
    {
        return res.status(404).json({error: "No such post found :("});
    }
    res.status(200).json(post);
}


module.exports = { getPosts, getPost, createPost, deletePost, updatePost }