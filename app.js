// Node.js and Express code for the backend

const Task = require('./models/task');
const express = require('express');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false)

const dbURI = "mongodb+srv://JP722:Sopro1234@taskmanage.hfom9s6.mongodb.net/TaskData?retryWrites=true&w=majority";

let tasks = [];

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', (req,res) => {
    tasks = [];
    Task.find()
        .then((result) =>{
            result.forEach(obj => tasks.push(obj.task));
            res.render('index', {tasks: tasks});
        })
        .catch((err) => {
            console.log(err);
        });
});

app.post('/', (req,res) => {
    tasks = [];

    const task = new Task({
        task: req.body.task
    });
    
    task.save()
     .then((result) =>{
        console.log(`Task ${result.task} has been saved to mongoDB`);
     })
     .catch((err) =>{
        console.log(err);
     });

     Task.find()
        .then((result) =>{
            result.forEach(obj => tasks.push(obj.task));
            res.render('index', {tasks: tasks});
        })
        .catch((err) => {
            console.log(err);
        });
});

// Sends error when this function is excuted
app.use((req, res) => {
    res.status(404).render('404', {title: 'Error'})
});

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