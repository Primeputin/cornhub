const User = require("../models/userModel");
const Post = require("../models/postModel");
const { deleteImageById } = require("./imageController")
const mongoose = require('mongoose');
const { deleteReplies } = require('./commentController');


// get all posts
const getPosts = async (req, res)=>{

    const posts = await Post.find({}).populate({
        path: 'user',
        populate: { path: 'profpic' }
    }).populate('postedImages').sort({createdAt: -1});
    res.status(200).json(posts);
}

// get all posts made by the user
const getPostsByUser = async (req, res)=>{
    const { id } = req.params
    const posts = await Post.find({user: id}).populate({
        path: 'user',
        populate: { path: 'profpic' }
    }).populate('postedImages').sort({createdAt: -1});
    res.status(200).json(posts);
}


const getPostsBySearch = async (req, res)=>{
    const { searchText } = req.params
    let searchArr = new Array;
    
    for(let i = 0; i< searchText.length; i++){//reformat it back so spaces can be searched
        if(searchText[i]=="_"){
            searchArr.push(" ");
        }else{
            searchArr.push(searchText[i]);
        }
    }

    const regex = new RegExp(searchArr.join(""), 'i');//i is for making it not case sensitive
    const posts = await Post.find({
        $or: [
            { title: { $regex: regex } },//regex makes it so that the fields dont have to be exact to return
            { desc: { $regex: regex } },
            { tags: { $in: [regex] } }
        ]
    }).populate({
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

    const post = await Post.findById(id).populate({
        path: 'user',
        populate: { path: 'profpic' }
    }).populate('postedImages').sort({createdAt: -1}).populate({
        path: 'comments',
        populate: { path: 'user', populate: {path: 'profpic'}}
    }).sort(({createdAt: -1}));

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
        const {user, title, desc, tags, postedImages, likes, dislikes} = req.body 

        const post = await Post.create({user, title, desc, tags, postedImages, likes, dislikes});

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
        return res.status(404).json({error: "No such user found :("});
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
            return res.status(404).json({ error: "No such post found :(" });
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

        res.status(200).json({ message: "Post and associated images deleted successfully" });
    } catch (error) {
        console.error("Error deleting post:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

// update a post
const updatePost = async (req, res)=>{
    const { id } = req.params

    // checks if the obj id is valid before proceeind to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error: "No such post found :("});
    }

    const findpost = await Post.findOne({_id: id});
    
    if (!findpost)
    {
        return res.status(404).json({error: "No such post found :("});
    }

    //console.log(req.body);
    
    if ((req.body.title && findpost.title != req.body.title) || (req.body.desc && findpost.desc != req.body.desc)){
        req.body.updatedAt = new Date();
       
    }

    const post = await Post.findOneAndUpdate({_id: id}, {...req.body});

    res.status(200).json(post);
}

module.exports = { getPosts, getPostsByUser, getPostsBySearch, getPost, createPost, deletePost, updatePost }