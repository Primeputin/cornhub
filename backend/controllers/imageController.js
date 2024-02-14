const Image = require("../models/imageModel");
const mongoose = require('mongoose');
  
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

// delete an image
const deleteImage = async (req, res)=>{
    const { id } = req.params
    // checks if the obj id is valid before proceeind to prevent an error in the db side
    if (!mongoose.Types.ObjectId.isValid(id))
    {
        return res.status(404).json({error: "No such image found :("});
    }

    const image = await Image.findOneAndDelete({_id: id});

    if (!image)
    {
        return res.status(404).json({error: "No such image found :("});
    }
    res.status(200).json(image);
}

module.exports = { getImages, getImage, createImage, deleteImage }