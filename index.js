const express = require('express');
const path = require('path');
const app = new express();
const ejs = require('ejs');
const mongoose = require('mongoose');
const PowerPost = require('./models/PowerPost.js')
var $ = require("jquery");
var mqtt = require('mqtt')
var io = require('socket.io')(http);


let Port = process.env.PORT;

if (Port == null || Port == "") {
    Port = 4000;
}

mongoose.connect('mongodb+srv://user1:user1@cluster0.jc6do.mongodb.net/EM330?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

app.set('view engine', 'ejs')
app.use("/public", express.static('./public/'))
app.use(express.json())
app.use(express.urlencoded())

app.get('/', async (req, res) => {
    const oneminPowerPosts = await PowerPost.find({})
    var wattarray = [];
    var datearray = [];
    for (var i = oneminPowerPosts.length - 5; i < oneminPowerPosts.length; i++) {
        wattarray.push(oneminPowerPosts[i].功率);
        datearray.push((oneminPowerPosts[i].createdAt.getYear() + 1900) + "-" +
            (oneminPowerPosts[i].createdAt.getMonth() + 1) + "-" +
            oneminPowerPosts[i].createdAt.getDate() + " " +
            oneminPowerPosts[i].createdAt.getHours() + ":" +
            oneminPowerPosts[i].createdAt.getMinutes() + ":" +
            oneminPowerPosts[i].createdAt.getSeconds())
    }
    wattarray = JSON.stringify(wattarray);
    datearray = JSON.stringify(datearray);
    res.render('index', {
        oneminPowerPosts: oneminPowerPosts,
        wattarray: wattarray,
        datearray: datearray
    });
})


app.get('/10min', async (req, res) => {
    const oneminPowerPosts = await PowerPost.find({})
    var tenminsPowerPosts = 0
    for (var i = 0; i < oneminPowerPosts.length; i++) {
        tenminsPowerPosts = tenminsPowerPosts + oneminPowerPosts[i].功率
    }
    tenminsPowerPosts = tenminsPowerPosts / oneminPowerPosts.length
    res.render('10min', {
        oneminPowerPosts: oneminPowerPosts,
        tenminsPowerPosts: tenminsPowerPosts.toFixed(2)
    });
})

var opt = {
    port: 1883,
    clientId: 'nodejs'
};

var client = mqtt.connect('mqtt://broker.emqx.io', opt);

client.on('connect', function () {
    client.subscribe('/EM330/shelly/25/on');
});

var http = app.listen(Port, () => {
    console.log("App listening on port 4000")
})
var sio = io.listen(http);
sio.sockets.on('connection', function (socket) {
    socket.on('on', function (value) {
        sss = value;
        console.log(value);
        var aaa = sss.toString();
        client.publish('/EM330/shelly/25/on', aaa)
    });
    
    socket.on('off', function (value) {
        sss = value;
        console.log(value);
        var aaa = sss.toString();
        client.publish('/EM330/shelly/25/off', aaa)
    });
});