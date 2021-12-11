const express = require('express');
const path = require('path');
const app = new express();
const ejs = require('ejs');
const mongoose = require('mongoose');

const EMPowernow = require('./models/EMPowernow.js')
const EMPowertenmin = require('./models/EMPowertemin')
const EMPowerhour = require('./models/EMPowerhours')
const EMPowerday = require('./models/EMPowerdays.js')

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
    const EMPowernows = await EMPowernow.find({})
    const EMPowertenmins = await EMPowertenmin.find({})
    const EMPowerhours = await EMPowerhour.find({})
    const EMPowerdays = await EMPowerday.find({})
    var nowwatt = EMPowernows[EMPowernows.length - 1].功率;
    var nowdate =
        EMPowernows[EMPowernows.length - 1].createdAt.getHours() + ":" +
        EMPowernows[EMPowernows.length - 1].createdAt.getMinutes();
    var tenminswatt = [];
    var tenminsdate = [];
    for (i = EMPowertenmins.length - 7; i < EMPowertenmins.length; i++) {
        tenminswatt.push(EMPowertenmins[i].十分鐘平均功率);
        tenminsdate.push(EMPowertenmins[i].createdAt.getHours() + ":" +
            EMPowertenmins[i].createdAt.getMinutes());
    }
    tenminswatt = JSON.stringify(tenminswatt);
    tenminsdate = JSON.stringify(tenminsdate);
    res.render('index2', {
        EMPowernow: EMPowernows,
        nowwatt: nowwatt,
        nowdate: nowdate,
        EMPowertenmin: EMPowertenmins,
        tenminswatt: tenminswatt,
        tenminsdate: tenminsdate
    });
})

var opt = {
    port: 1883,
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`
};

var client = mqtt.connect('mqtt://broker.emqx.io', opt);

client.on('connect', function () {
    client.subscribe('/EM330/shelly/25/on');
    client.subscribe('/EM330/shelly/25/off');
    client.subscribe('/EM330/sensibo/on');
    client.subscribe('/EM330/sensibo/off');
});

var http = app.listen(Port, () => {
    console.log("App listening on port 4000")
})
var sio = io.listen(http);

sio.sockets.on('connection', function (socket) {
    socket.on('25on', function () {
        // client.publish('/EM330/shelly/25/on', aaa)
        client.publish('/EM330/shelly/25/on', 'on')
    });

    socket.on('25off', function () {
        // client.publish('/EM330/shelly/25/off', aaa)
        client.publish('/EM330/shelly/25/off', 'on')
    });
});





// (EMPowernows[EMPowernows.length - 1].createdAt.getYear() + 1900) + "-" +
//         (EMPowernows[EMPowernows.length - 1].createdAt.getMonth() + 1) + "-" +
//         EMPowernows[EMPowernows.length - 1].createdAt.getDate() + " " ;