const express = require('express');
const path = require('path');
const app = new express();
const ejs = require('ejs');
const mongoose = require('mongoose');

const EMPowernow = require('./models/EMPowernow.js')
const EMPowertenmin = require('./models/EMPowertemin.js')
const EMPowerhour = require('./models/EMPowerhours.js')
const EMPowerday = require('./models/EMPowerdays.js')
const TFPowernow = require('./models/TFPowernow.js')
const TFPowertenmin = require('./models/TFPowertemin.js')
const TFPowerhour = require('./models/TFPowerhours.js')
const TFPowerday = require('./models/TFPowerdays.js')
const ACPost = require('./models/ACPost.js')
var $ = require("jquery");
var mqtt = require('mqtt');
const {
    Socket
} = require('socket.io');
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
    const TFPowernows = await TFPowernow.find({})
    const TFPowertenmins = await TFPowertenmin.find({})
    const TFPowerhours = await TFPowerhour.find({})
    const TFPowerdays = await TFPowerday.find({})
    const ACPosts = await ACPost.find({})

    var EMnowwatt = EMPowernows[EMPowernows.length - 1].功率;
    var EMnowvolt = EMPowernows[EMPowernows.length - 1].電壓;
    var EMnowdate =
        EMPowernows[EMPowernows.length - 1].createdAt.getHours() + ":" +
        EMPowernows[EMPowernows.length - 1].createdAt.getMinutes();
    var EMtenminswatts = [];
    var EMtenminsdates = [];
    for (i = EMPowertenmins.length - 7; i < EMPowertenmins.length; i++) {
        EMtenminswatts.push(EMPowertenmins[i].十分鐘平均功率);
        EMtenminsdates.push(EMPowertenmins[i].createdAt.getHours() + ":" +
            EMPowertenmins[i].createdAt.getMinutes());
    }
    EMtenminswatts = JSON.stringify(EMtenminswatts);
    EMtenminsdates = JSON.stringify(EMtenminsdates);

    var TFnowwatt = TFPowernows[TFPowernows.length - 1].功率;
    var TFnowdate =
        TFPowernows[TFPowernows.length - 1].createdAt.getHours() + ":" +
        TFPowernows[TFPowernows.length - 1].createdAt.getMinutes();
    var TFtenminswatts = [];
    var TFtenminsdates = [];
    for (i = TFPowertenmins.length - 7; i < TFPowertenmins.length; i++) {
        TFtenminswatts.push(TFPowertenmins[i].十分鐘平均功率);
    }
    TFtenminswatts = JSON.stringify(TFtenminswatts);

    var ACtmp = ACPosts[ACPosts.length - 1].溫度;
    var AChum = ACPosts[ACPosts.length - 1].濕度;
    var AChumarray = [];
    var ACnowdate =
        ACPosts[ACPosts.length - 1].createdAt.getHours() + ":" +
        ACPosts[ACPosts.length - 1].createdAt.getMinutes();
    for (i = ACPosts.length - 7; i < ACPosts.length; i++) {
        AChumarray.push(ACPosts[i].濕度);
    };
    AChumarray = JSON.stringify(AChumarray);
    var nowsendfirst,
        nowsendsec,
        nowsendthird,
        nowsendfour,
        nowsendfive;
    if (sendflag == 0) {
        nowsendfirst = "當前用電量";
        nowsendsec = "Watt";
        nowsendthird = EMnowwatt + " w";
        nowsendfour = "Voltage";
        nowsendfive = EMnowvolt + " V";
    } else if (sendflag == 1) {
        nowsendfirst = "當前用電量";
        nowsendsec = "Watt";
        nowsendthird = TFnowwatt + " w";
        nowsendfour = "Voltage";
        nowsendfive = EMnowvolt + " V";
    } else if (sendflag == 2) {
        nowsendfirst = "當前冷氣狀態";
        nowsendsec = "溫度";
        nowsendthird = ACtmp + " 度";
        nowsendfour = "濕度";
        nowsendfive = AChum + " %";
    }
    
    res.render('index2', {
        EMPowernow: EMPowernows,
        EMnowwatt: EMnowwatt,
        EMnowdate: EMnowdate,
        EMPowertenmin: EMPowertenmins,
        EMtenminswatt: EMtenminswatts,
        EMtenminsdate: EMtenminsdates,

        TFPowernow: TFPowernows,
        TFnowwatt: TFnowwatt,
        TFnowdate: TFnowdate,
        TFPowertenmin: TFPowertenmins,
        TFtenminswatt: TFtenminswatts,

        ACtmps: ACtmp,
        AChums: AChum,
        AChumarrays: AChumarray,
        ACnowdates: ACnowdate,

        nowsendfirsts:nowsendfirst,
        nowsendsecs:nowsendsec,
        nowsendthirds:nowsendthird,
        nowsendfours:nowsendfour,
        nowsendfives:nowsendfive
    });
})

var opt = {
    port: 1883,
    clientId: `mqtt_${Math.random().toString(16).slice(3)}`
};

var client = mqtt.connect('mqtt://broker.emqx.io', opt);

client.on('connect', function () {
    client.subscribe('/EM330/shelly25/on');
    client.subscribe('/EM330/shelly25/off');
    client.subscribe('/EM330/sensibo/ON');
    client.subscribe('/EM330/sensibo/OFF');
});

var http = app.listen(Port, () => {
    console.log("App listening on port 4000")
})
var sio = io.listen(http);

var sendflag = 0;

sio.sockets.on('connection', function (socket) {
    socket.on('25on', function () {
        client.publish('/EM330/shelly25/on', 'on')
    });
    socket.on('25off', function () {
        client.publish('/EM330/shelly25/off', 'off')
    });
    socket.on('ACon', function () {
        client.publish('/EM330/sensibo/ON', 'on')
    });

    socket.on('ACoff', function () {
        client.publish('/EM330/sensibo/OFF', 'off')
    });
    socket.on('btnSW', function (num) {
        sendflag = num;
    })
});





// (EMPowernows[EMPowernows.length - 1].createdAt.getYear() + 1900) + "-" +
//         (EMPowernows[EMPowernows.length - 1].createdAt.getMonth() + 1) + "-" +
//         EMPowernows[EMPowernows.length - 1].createdAt.getDate() + " " ;