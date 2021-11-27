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
app.use("/public",express.static('./public/'))
app.use(express.json())
app.use(express.urlencoded())

app.get('/', async(req, res) => {
    const oneminPowerPosts = await PowerPost.find({})
    var wattarray = [];
    var datearray = [];
    for(var i =oneminPowerPosts.length-5;i<oneminPowerPosts.length;i++){
        wattarray.push(oneminPowerPosts[i].功率);
        datearray.push((oneminPowerPosts[i].createdAt.getYear()+1900)+"-"
        +(oneminPowerPosts[i].createdAt.getMonth()+1)+"-"
        +oneminPowerPosts[i].createdAt.getDate()+" "
        +oneminPowerPosts[i].createdAt.getHours()+":"
        +oneminPowerPosts[i].createdAt.getMinutes()+":"
        +oneminPowerPosts[i].createdAt.getSeconds())
    }
    wattarray = JSON.stringify(wattarray);
    datearray = JSON.stringify(datearray);
    res.render('index',{
        oneminPowerPosts:oneminPowerPosts,
        wattarray:wattarray,
        datearray:datearray
    });
})

app.get('/10min', async(req, res) => {
    const oneminPowerPosts = await PowerPost.find({})
    var tenminsPowerPosts = 0
    for(var i =0 ; i < oneminPowerPosts.length ; i++){
        tenminsPowerPosts=tenminsPowerPosts + oneminPowerPosts[i].功率
        console.log(oneminPowerPosts[i].createdAt)
    }
    tenminsPowerPosts = tenminsPowerPosts/oneminPowerPosts.length
    res.render('10min',{
        oneminPowerPosts:oneminPowerPosts,
        tenminsPowerPosts:tenminsPowerPosts.toFixed(2)
    });
})


app.listen(port, () => {
    console.log("App listening on port 4000")
})