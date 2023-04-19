// Node.js and Express code for the backend

// Get modules needed for the project
require('dotenv').config();
const Task = require('./models/task');
const express = require('express');
const mongoose = require('mongoose');

// Sets it so that mongoose will send anything even not specified in schema
mongoose.set('strictQuery', false)

// database URI saved in .env file
const dbURI = process.env.MONGODB_URI;

// init express app
const app = express();

// parses incoming requests with JSON
app.use(express.json());

// parses urlencoded payloads
app.use(express.urlencoded({extended: true}));

// allows for the use of ejs as our view engine
app.set('view engine', 'ejs');

// searches the public folders for static files like CSS files
app.use(express.static('public'));

// renders the home page with contents from the database when sending a get request
app.get('/', (req,res) => {
    Task.find()
        .then((result) =>{
            res.render('index', {tasks: result});
        })
        .catch((err) => {
            console.log(err.message);
        });
});

// renders the home page with contents from the database when sending a post request
app.post('/', (req,res) => {
    const task = new Task({
        task: req.body.task
    });
    
    // Saves the task to the database
    task.save()
     .then((result) =>{
        console.log(`Task ${result.task} has been saved to mongoDB`);
        Task.find()
            .then((result) =>{
                res.render('index', {tasks: result});
            })
            .catch((err) => {
                console.log(err.message);
            });

     })
     .catch((err) =>{
        console.log(err.message);
     });
});

// Deletes the item from the database
app.delete('/:id', (req, res) => {
    Task.findByIdAndDelete(req.params.id)
        .then(result => {
            res.json({redirect: '/'});
        })
        .catch((err) => {
            console.log(err.message);
        })
})

// Sends error when this function is excuted
app.use((req, res) => {
    res.status(404).render('404', {title: 'Error'})
});

// This function connects to the database
const start = async () => {
    try{
        await mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true});
        app.listen(3000, () => {
            console.log("Listening on port 3000");
        });
    }
    catch(err){
        console.log(err.message);
    }
};

start();