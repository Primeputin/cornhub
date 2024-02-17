const User = require("../models/userModel");
const mongoose = require('mongoose');


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

    const user = await Post.findById(id);

    if (!user)
    {
        return res.status(404).json({error: "No such user found :("});
    }
    res.status(200).json(user);
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

    const user = await User.findOneAndDelete({_id: id});

    if (!user)
    {
        return res.status(404).json({error: "No such user found :("});
    }
    res.status(200).json(user);
}

// update a user
const updateUser = async (req, res)=>{
    const { id } = req.params
    // checks if the obj id is valid before proceeind to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error: "No such user found :("});
    }

    const user = await Post.findOneAndUpdate({_id: id}, {...req.body});

    if (!post)
    {
        return res.status(404).json({error: "No such user found :("});
    }
    res.status(200).json(user);
}


module.exports = { getUsers, getUser, createUser, checkUser, deleteUser, updateUser }