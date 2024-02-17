require('dotenv').config()


const express = require('express');
const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const imageRoutes = require('./routes/images');
const userRoutes = require('./routes/users');
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
app.use("/api/comments", commentRoutes)
app.use("/api/uploads", imageRoutes)
app.use("/api/users", userRoutes)

// connect to db
mongoose.connect(process.env.MONGURI).then(()=>{
    console.log("Connected");
}).catch((error)=>{console.log(error);})

// listens for request
app.listen(process.env.PORT, ()=>{
    console.log("Listening on port", process.env.PORT);
})