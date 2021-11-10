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
    const oneminPowerPosts = await PowerPost.find({})
    res.render('index',{
        oneminPowerPosts:oneminPowerPosts
    });
})

app.get('/10min', async(req, res) => {
    const oneminPowerPosts = await PowerPost.find({})
    var tenminsPowerPosts = 0
    for(var i =0 ; i < oneminPowerPosts.length ; i++){
        tenminsPowerPosts=tenminsPowerPosts + oneminPowerPosts[i].WATT
    }
    tenminsPowerPosts = tenminsPowerPosts/oneminPowerPosts.length
    console.log(tenminsPowerPosts.toFixed(2))
    res.render('10min',{
        oneminPowerPosts:oneminPowerPosts,
        tenminsPowerPosts:tenminsPowerPosts.toFixed(2)
    });
})



app.listen(port, () => {
    console.log("App listening on port 4000")
})



