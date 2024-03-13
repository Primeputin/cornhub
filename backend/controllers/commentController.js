const Comment = require("../models/commentModel");
const mongoose = require('mongoose');


// This is an asynchronous function named 'getComments'
const getComments = async (req, res) => {
    try {
        // This line retrieves all documents from the 'Comment' collection in the database
        // The '{}' is an empty filter, meaning it matches all documents in the collection
        // The 'sort({ createdAt: -1 })' sorts the retrieved documents by the 'createdAt' field in descending order
        const comments = await Comment.find({}).sort({ createdAt: -1 });

        // This 'if' statement checks if any comments were retrieved from the database
        // If no comments were found, it sends a 404 status code with a JSON response
        if (!comments) {
            return res.status(404).json({ message: "No comments found" });
        }

        // If comments were found, it sends a 200 status code along with the comments in a JSON format
        return res.status(200).json(comments);
    } catch (error) {
        // If an error occurs during the execution of the 'try' block, the function catches the error
        console.error("Error while fetching comments:", error);
        
        // It then sends a 500 status code with a JSON response
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This is an asynchronous function named getCommentsByUser. It's an Express.js route handler that takes in a request (req) and a response (res) object.
const getCommentsByUser = async (req, res) => {
    try {
        // Destructure the id from the request parameters. This is the id of the user whose comments we want to retrieve.
        const { id } = req.params

        // Use the Comment model to find all comments made by the user with the given id. The comments are sorted by the createdAt field in descending order (most recent first).
        const comments = await Comment.find({user: id}).sort({ createdAt: -1 });

        // Check if any comments were found. If not, send a 404 status code with a message saying "No comments found".
        if (!comments) {
            return res.status(404).json({ message: "No comments found" });
        }

        // If comments were found, send a 200 status code (OK) along with the comments in the response.
        return res.status(200).json(comments);
    } catch (error) {
        // If there's an error at any point in the try block, it's caught here. The error is logged to the console.
        console.error("Error while fetching comments:", error);

        // An error message is sent back to the client with a 500 status code (Internal Server Error).
        return res.status(500).json({ message: "Internal server error" });
    }
}

// This is an asynchronous function named getComment. It's an Express.js route handler that takes in a request (req) and a response (res) object.
const getComment = async (req, res)=>{

    // Destructure the id from the request parameters. This is the id of the comment we want to retrieve.
    const { id } = req.params

    // Checks if the id is a valid MongoDB ObjectId before proceeding to prevent an error in the database side.
    // If the id is not valid, it sends a 404 status code with a message saying "No such post found :(".
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({ error: "No such post found :(" });
    }

    // Use the Comment model to find a comment by its id.
    // The findById method returns a promise that resolves to the comment document if found, or to null if not found.
    const comment = await Comment.findById(id).populate("user");
    


    // Check if the comment was found. If not, send a 404 status code with a message saying "No such post found :(".
    if (!comment)
    {
        return res.status(404).json({ error: "No such post found :(" });
    }
     comment.user = await comment.user.populate("profpic"); 
     console.log(comment);
    // If the comment was found, send a 200 status code (OK) along with the comment in the response.
    res.status(200).json(comment);
}

// This is an asynchronous function named createComment. It's an Express.js route handler that takes in a request (req) and a response (res) object.
const createComment =  async (req, res)=>{

    // Destructure the user, comment, and replies from the request body. These are the details of the comment we want to create.
    const { user, comment, replies } = req.body

    // Try block starts here. If there's an error anywhere within this block, it will be caught and handled in the catch block.
    try
    {   
        // Use the Comment model to create a new comment with the given user, comment, and replies. The create method returns a promise that resolves to the created comment document.
        const createdComment = await Comment.create({user, comment, replies});
        // Populate the user field of the created comment. This replaces the user id with the actual user document. The populate method returns a promise that resolves to the comment document with the populated user field.
        await createdComment.populate("user");
        // Populate the profpic field of the user document. This replaces the profpic id with the actual profpic document. The populate method returns a promise that resolves to the user document with the populated profpic field.
        await createdComment.user.populate("profpic");
        // If the comment was created successfully, send a 200 status code (OK) along with the created comment in the response.
        res.status(200).json(createdComment);
    }
    // Catch block starts here. If there's an error in the try block, it will be caught here.
    catch(error)
    {
        // Log the error to the console.
        console.log(error);
    }
}

// This is an asynchronous function named deleteComment. It's an Express.js route handler that takes in a request (req) and a response (res) object.
const deleteComment = async (req, res) => {

    // Destructure the id from the request parameters. This is the id of the comment we want to delete.
    const { id } = req.params;
    
    // Check if the id is a valid MongoDB ObjectId before proceeding to prevent an error in the database side.
    // If the id is not valid, it sends a 404 status code with a message saying "No such post found :(".
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json.error({ error: "No such post found :(" });
    }

    // Try block starts here. If there's an error anywhere within this block, it will be caught and handled in the catch block.
    try {

        // Use the Comment model to find a comment by its id and delete it.
        // The findOneAndDelete method returns a promise that resolves to the deleted comment document if found, or to null if not found.
        const comment = await Comment.findOneAndDelete({ _id: id });

        // Check if the comment was found and deleted. If not, send a 404 status code with a message saying "No such post found :(".
        if (!comment) {
            return res.status(404).json({ error: "No such post found :(" });
        }

        // Iterate over all comments in the database and remove the id of the deleted comment from the replies array of each comment.
        // The updateMany method updates all documents in the collection that match the given filter.
        // The $pull operator removes from an existing array all instances of a value or values that match a specified condition.
        await Comment.updateMany({}, { $pull: { replies: id } });

        // If the comment and its associated replies were deleted successfully, send a 200 status code (OK) along with a success message in the response.
        return res.status(200).json({ message: "Comment and associated replies deleted successfully." });
    } 

    // Catch block starts here. If there's an error in the try block, it will be caught here.
    catch (error) {

        // Log the error to the console.
        console.error("Error deleting comment and associated replies:", error);

        // Send a 500 status code (Internal Server Error) along with an error message in the response.
        return res.status(500).json({ error: "Internal server error." });
    }
};


// This is an asynchronous function named updateComment. It's an Express.js route handler that takes in a request (req) and a response (res) object.
const updateComment = async (req, res) => {

    // Destructure the id from the request parameters. This is the id of the comment we want to update.
    const { id } = req.params;

    // Check if the id is a valid MongoDB ObjectId before proceeding to prevent an error in the database side.
    // If the id is not valid, it sends a 404 status code with a message saying "No such post found :(".
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such post found :(" });
    }

    // Try block starts here. If there's an error anywhere within this block, it will be caught and handled in the catch block.
    try {

        // Use the Comment model to find a comment by its id and update it with the new data from the request body.
        // The findOneAndUpdate method returns a promise that resolves to the updated comment document if found, or to null if not found.
        // The { new: true } option ensures that the method returns the updated comment.
        const updatedComment = await Comment.findOneAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true } // Return the updated document
        );

        // Check if the comment was found and updated. If not, send a 404 status code with a message saying "No such post found :(".
        if (!updatedComment) {
            return res.status(404).json({ error: "No such post found :(" });
        }

        // If the comment was found and updated successfully, send a 200 status code (OK) along with the updated comment in the response.
        res.status(200).json(updatedComment);
    } 

    // Catch block starts here. If there's an error in the try block, it will be caught here.
    catch (error) {

        // Log the error to the console.
        console.error("Error updating comment:", error);

        // Send a 500 status code (Internal Server Error) along with an error message in the response.
        res.status(500).json({ error: "Internal server error" });
    }
}; 

module.exports = { getComments, getCommentsByUser, getComment, createComment, deleteComment, updateComment }