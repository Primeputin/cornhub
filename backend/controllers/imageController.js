const Image = require("../models/imageModel");
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
  
// get all images
const getImages = async (req, res)=>{

    const images = await Image.find({});
    res.status(200).json(images);
}

// get an image
const getImage = async (req, res)=>{
    const { id } = req.params
    // checks if the obj id is valid before proceed to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error: "No such image found :("});
    }

    const image = await Image.findById(id);

    if (!image)
    {
        return res.status(404).json({error: "No such image found :("});
    }
    res.status(200).json(image);
}

// get the actualimage
const getActualImage = async (req, res) => {
    try {
        const filename = req.params.filename;

        // construct an actual path to the actual image file
        const imagePath = path.join(__dirname, '../uploads', filename);

        // Log the imagePath for debugging
        console.log('Image Path:', imagePath);

        // Check if the file exists
        try {
            await fs.promises.access(imagePath, fs.constants.F_OK);
        } catch (error) {
            console.error('File does not exist');
            return res.status(404).send('Image not found');
        }

        res.sendFile(imagePath);
    } catch (error) {
        console.error('Error serving image:', error);
        res.status(500).send('Internal Server Error');
    }
};


const createImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }
                
        const image = await Image.create({
            // these properties are given by multer already
            filename: req.file.filename,
            path: req.file.path,
        });

        console.log('Image uploaded successfully');
        res.status(200).json(image);
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createImages = async (req, res) => {
    try {
        const uploadedFiles = req.files; // notice: files is an array instead of just one file instance
        const uploadedImages = [];

        for (const file of uploadedFiles) {
            const image = new Image({
                filename: file.originalname,
                path: file.path,
            });
            
            // Save the image document to MongoDB
            const savedImage = await Image.create(image);
            
            // Push the saved image to the uploadedImages array
            uploadedImages.push(savedImage);
        }

        res.status(200).json({ uploadedImages });
    } catch (error) {
        console.error('Error uploading images:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// delete an image
const deleteImage = async (req, res)=>{
    const { id } = req.params;
    
    // checks if the obj id is valid before proceeding to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "No such image found :(" });
    }

    try {
        const image = await Image.findOneAndDelete({ _id: id });

        if (!image) {
            return res.status(404).json({ error: "No such image found :(" });
        }

        // Delete the file with using the image's file path
        fs.unlink(image.path, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return res.status(500).json({ error: "Error deleting image file" });
            }
            console.log('File deleted successfully');
            res.status(200).json(image);
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const deleteImageById = async (id)=>{
    
    // checks if the obj id is valid before proceeding to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id)) {
        console.log("No such image found:(")
    }

    try {
        const image = await Image.findOneAndDelete({ _id: id });

        if (!image) {
            console.error("No such image found:(");
            return;
        }

        // Delete the file with using the image's file path
        fs.unlink(image.path, (err) => {
            if (err) {
                console.error('Error deleting file:', err);
                return;
            }
            console.log('File deleted successfully');
        });
    } catch (error) {
        console.error('Error deleting image:', error);
    }
}

module.exports = { getImages, getImage, getActualImage, createImage, createImages, deleteImage, deleteImageById }