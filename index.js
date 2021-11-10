const express = require('express')
const path = require('path')
const app = new express();
const ejs = require('ejs')
const mongoose = require('mongoose');
const PowerPost = require('./models/PowerPost.js')
var $ = require( "jquery" );
let port = process.env.PORT;

if(port == null||port==""){
    port=4000;
}


mongoose.connect('mongodb+srv://user1:test123@cluster0.jc6do.mongodb.net/EM330?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded())

app.get('/', async(req, res) => {
    const PowerPosts = await PowerPost.find({})
    res.render('index',{
        PowerPosts:PowerPosts
    });
})

app.get('/about', (req, res) => {
    res.render('about');
})

app.get('/contact', (req, res) => {
    res.render('contact');
})

app.get('/post', (req, res) => {
    res.render('post');
})

app.get('/post/new', (req, res) => {
    res.render('create')
})

app.post('/posts/store', async(req, res) => {
    await BlogPost.create(req.body, (error, blogpost) => {
    })
})

app.listen(port, () => {
    console.log("App listening on port 4000")
})



