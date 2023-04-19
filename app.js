// Node.js and Express code for the backend

require('dotenv').config();
const Task = require('./models/task');
const express = require('express');
const mongoose = require('mongoose');

mongoose.set('strictQuery', false)

const dbURI = process.env.MONGODB_URI;

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
            res.render('index', {tasks: result});
        })
        .catch((err) => {
            console.log(err.message);
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
    res.status(404).render('/404', {title: 'Error'})
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