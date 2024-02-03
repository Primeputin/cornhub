require('dotenv').config()


const express = require('express');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const cors = require('cors');

// express app
const app = express();

app.use(cors()); // for allowing Cross-Origin Resource Sharing

// middleware
app.use(express.json()); // parse incoming JSON requests

app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

// routes
app.use("/api/posts", postRoutes)

// connect to db
mongoose.connect(process.env.MONGURI).then(()=>{
    console.log("Connected");
}).catch((error)=>{console.log(error);})

// listens for request
app.listen(process.env.PORT, ()=>{
    console.log("Listening on port 3000");
})