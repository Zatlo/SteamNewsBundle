const express = require('express'); //require what we need
const cors = require('cors');
const mongoose = require('mongoose'); //connect go mongodb database
const router = require('express').Router();


require('dotenv').config(); // have our env variables in .mv file?

const app = express(); //express erver
const port = process.env.Port || 3000;

app.use(cors()); //middleware 
app.use(express.json()); //allow to parse jsons

// router.get("/", (req, res) => {
//     res.setHeader("Access-Control-Allow-Origin", "*")
//     res.setHeader("Access-Control-Allow-Credentials", "true");
//     res.setHeader("Access-Control-Max-Age", "1800");
//     res.setHeader("Access-Control-Allow-Headers", "content-type");
//     res.setHeader( "Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS" ); 
//      });

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
);


const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const newsRouter = require('./routes/news');
const usersRouter = require('./routes/users');
const bundlesRouter = require('./routes/bundles');
const userSessionRouter = require('./routes/usersession');
const steamGamesRouter = require('./routes/steamgames');


app.use('/news', newsRouter);
app.use('/users', usersRouter);
app.use('/bundles', bundlesRouter);
app.use('/sessions', userSessionRouter);
app.use('/steamgames', steamGamesRouter);


//heroku
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('build'));
}


app.listen(port, ()=> { //starts server
    console.log(`Server is running on port: ${port}`);
})