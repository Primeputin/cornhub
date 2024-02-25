const Comment = require("../models/commentModel");
const mongoose = require('mongoose');


// get all comments
const getComments = async (req, res) => {
    try {
        // Retrieve comments sorted by createdAt date in descending order
        const comments = await Comment.find({}).sort({ createdAt: -1 });

        // Check if comments are found
        if (!comments) {
            return res.status(404).json({ message: "No comments found" });
        }

        // Return the comments
        return res.status(200).json(comments);
    } catch (error) {
        console.error("Error while fetching comments:", error);
        // Return an error response
        return res.status(500).json({ message: "Internal server error" });
    }
}

const getCommentsByUser = async (req, res) => {
    try {
        const { id } = req.params
        // Retrieve comments sorted by createdAt date in descending order
        const comments = await Comment.find({user: id}).sort({ createdAt: -1 });

        // Check if comments are found
        if (!comments) {
            return res.status(404).json({ message: "No comments found" });
        }

        // Return the comments
        return res.status(200).json(comments);
    } catch (error) {
        console.error("Error while fetching comments:", error);
        // Return an error response
        return res.status(500).json({ message: "Internal server error" });
    }
}


// get a comment
const getComment = async (req, res)=>{
    const { id } = req.params
    // checks if the obj id is valid before proceeind to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({ error: "No such post found :(" });
    }

    const comment = await Comment.findById(id);

    if (!comment)
    {
        return res.status(404).json({ error: "No such post found :(" });
    }
    res.status(200).json(comment);
}

// create a comment
const createComment =  async (req, res)=>{

    const { comment, replies } = req.body
    try
    {   
        const createdComment = await Comment.create({comment, replies});
        res.status(200).json(createdComment);
    }
    catch(error)
    {
        console.log(error);
    }
}

// delete a comment
const deleteComment = async (req, res) => {
    const { id } = req.params;
    
    // Check if the obj id is valid before proceeding to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json.error({ error: "No such post found :(" });
    }

    try {
        // Find the comment that is being deleted
        const comment = await Comment.findOneAndDelete({ _id: id });

        if (!comment) {
            return res.status(404).json({ error: "No such post found :(" });
        }

        // Iterate over all comments in the database
        await Comment.updateMany({}, { $pull: { replies: id } });

        // Respond with a success message
        return res.status(200).json({ message: "Comment and associated replies deleted successfully." });
    } catch (error) {
        console.error("Error deleting comment and associated replies:", error);
        return res.status(500).json({ error: "Internal server error." });
    }
};


// update a Comment
const updateComment = async (req, res) => {
    const { id } = req.params;

    // Check if the object id is valid before proceeding to prevent an error in the database side
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such post found :(" });
    }

    try {
        const updatedComment = await Comment.findOneAndUpdate(
            { _id: id },
            { ...req.body },
            { new: true } // Return the updated document
        );

        if (!updatedComment) {
            return res.status(404).json({ error: "No such post found :(" });
        }

        res.status(200).json(updatedComment);
    } catch (error) {
        console.error("Error updating comment:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = { getComments, getCommentsByUser, getComment, createComment, deleteComment, updateComment }