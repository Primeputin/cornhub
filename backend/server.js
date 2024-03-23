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

app.use(cors(
    {
        origin: ["http://localhost:5173", "https://cornhub-frontend.onrender.com"],
        credentials: true,
    }
)); // for allowing Cross-Origin Resource Sharing

// middleware
app.use(express.json()); // parse incoming JSON requests

// connect to db
mongoose.connect(process.env.MONGURI).then(()=>{
    console.log("Connected");
}).catch((error)=>{console.log(error);})

const session = require('express-session');
const mongoStore = require('connect-mongodb-session')(session);

app.set("trust proxy", 1); // for render deployment

//connect the sessions with the mongoose connection. This will save the
//sessions on the server on its own schema.
//For expires, a common value is 14 days or 14*24*60*60*1000,
//secret - This is the secret used to sign the session ID cookie.
//saveUninitialized - Forces a session that is "uninitialized" to be saved 
//    to the store. A session is uninitialized when it is new but not modified.
//resave - Forces the session to be saved back to the session store, even if 
//    the session was never modified during the request.
//store -> collection - the collection where the sessions are stored in mongo.
//store -> expires - the life duration of a session.
app.use((req, res, next) => {
    const remember = req.body && req.body.remember;
    const sessionConfig = {
        secret: 'I love corns so much because it is delicious',
        saveUninitialized: false, 
        resave: false,
        store: new mongoStore({ 
          uri: process.env.MONGURI,
          collection: 'session',
          expires: remember ? 1000 * 60 * 60 * 24 * 21 : 1000 * 60 * 60
        }),
        cookie: {
            sameSite: 'none'
        }
        
    };
    
    session(sessionConfig)(req, res, next);
});


app.use((req, res, next) => {
    console.log(req.path, req.method);
    next();
})

// routes
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/uploads", imageRoutes)
app.use("/api/users", userRoutes)

// listens for request
app.listen(process.env.PORT, ()=>{
    console.log("Listening on port", process.env.PORT);
})