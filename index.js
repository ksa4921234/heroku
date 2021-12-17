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
    //EM當下
    var EMnowwatt = EMPowernows[EMPowernows.length - 1].功率;
    var EMnowvolt = EMPowernows[EMPowernows.length - 1].電壓;
    var EMnowdate =
        EMPowernows[EMPowernows.length - 1].createdAt.getHours() + ":" +
        EMPowernows[EMPowernows.length - 1].createdAt.getMinutes();
    //EM十分鐘
    var EMtenminsargwatts = [],
        EMtenminstotalwatts = [],
        EMtenminsdates = [];
    for (i = EMPowertenmins.length - 7; i < EMPowertenmins.length; i++) {
        EMtenminsargwatts.push(EMPowertenmins[i].十分鐘平均功率);
        EMtenminstotalwatts.push(EMPowertenmins[i].十分鐘總共功率);
        EMtenminsdates.push(EMPowertenmins[i].createdAt.getHours() + ":" +
            EMPowertenmins[i].createdAt.getMinutes());
    }
    EMtenminsargwatts = JSON.stringify(EMtenminsargwatts);
    EMtenminstotalwatts = JSON.stringify(EMtenminstotalwatts);
    EMtenminsdates = JSON.stringify(EMtenminsdates);
    //EM一小時
    var EMhourargwatts = [],
        EMhourtotalwatts = [],
        EMhoursdates = [];
    if (EMPowerhours.length >= 24) {
        for (i = EMPowerhours.length - 24; i < EMPowerhours.length; i++) {
            EMhourargwatts.push(EMPowerhours[i].小時平均功率);
            EMhourtotalwatts.push(EMPowerhours[i].小時總共功率);
            EMhoursdates.push(EMPowerhours[i].createdAt.getDate() + "日" +
                EMPowerhours[i].createdAt.getHours() + "時");
        }

    } else {
        for (i = 0; i < 24; i++) {
            EMhourargwatts.push(0);
            EMhourtotalwatts.push(0);
            EMhoursdates.push("No Data on Server!");
        }
    }
    EMhourargwatts = JSON.stringify(EMhourargwatts);
    EMhourtotalwatts = JSON.stringify(EMhourtotalwatts);
    EMhoursdates = JSON.stringify(EMhoursdates);
    //TF當下
    var TFnowwatt = TFPowernows[TFPowernows.length - 1].功率;
    var TFnowdate =
        TFPowernows[TFPowernows.length - 1].createdAt.getHours() + ":" +
        TFPowernows[TFPowernows.length - 1].createdAt.getMinutes();
    //TF十分鐘
    var TFtenminsargwatts = [],
        TFtenminstotalwatts = [];
    for (i = TFPowertenmins.length - 7; i < TFPowertenmins.length; i++) {
        TFtenminsargwatts.push(TFPowertenmins[i].十分鐘平均功率);
        TFtenminstotalwatts.push(TFPowertenmins[i].十分鐘總共功率);
    }
    TFtenminsargwatts = JSON.stringify(TFtenminsargwatts);
    TFtenminstotalwatts = JSON.stringify(TFtenminstotalwatts);
    //TF小時
    var TFhourargwatts = [],
        TFhourtotalwatts = [];
    if (TFPowerhours.length >= 24) {
        for (i = TFPowerhours.length - 24; i < TFPowerhours.length; i++) {
            TFhourargwatts.push(TFPowerhours[i].小時平均功率);
            TFhourtotalwatts.push(TFPowerhours[i].小時總共功率)
        }

    } else {
        for (i = 0; i < 24; i++) {
            TFhourargwatts.push(0);
            TFhourtotalwatts.push(0);
        }
    }
    TFhourargwatts = JSON.stringify(TFhourargwatts);
    TFhourtotalwatts = JSON.stringify(TFhourtotalwatts);
    var ACtmp = ACPosts[ACPosts.length - 1].溫度;
    var AChum = ACPosts[ACPosts.length - 1].濕度;
    var AChumarray = [];
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
        nowsendthird = EMnowwatt + " wh";
        nowsendfour = "Voltage";
        nowsendfive = EMnowvolt + " V";
    } else if (sendflag == 1) {
        nowsendfirst = "當前用電量";
        nowsendsec = "Watt";
        nowsendthird = TFnowwatt + " wh";
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
        EMtenminsargwatt: EMtenminsargwatts,
        EMtenminstotalwatt:EMtenminstotalwatts,
        EMhourargwatt: EMhourargwatts,
        EMhourtotalwatt:EMhourtotalwatts,
        EMtenminsdate: EMtenminsdates,
        EMhoursdate: EMhoursdates,

        TFPowernow: TFPowernows,
        TFnowwatt: TFnowwatt,
        TFnowdate: TFnowdate,
        TFtenminsargwatt: TFtenminsargwatts,
        TFtenminstotalwatt:TFtenminstotalwatts,
        TFhourargwatt: TFhourargwatts,
        TFhourtotalwatt: TFhourtotalwatts,

        ACtmps: ACtmp,
        AChums: AChum,
        AChumarrays: AChumarray,

        nowsendfirsts: nowsendfirst,
        nowsendsecs: nowsendsec,
        nowsendthirds: nowsendthird,
        nowsendfours: nowsendfour,
        nowsendfives: nowsendfive
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
    socket.on('TF0on', function () {
        client.publish('/EM330/shelly25/0on', 'on')
    });
    socket.on('TF0off', function () {
        client.publish('/EM330/shelly25/0off', 'off')
    });
    socket.on('TF1on', function () {
        client.publish('/EM330/shelly25/1on', 'on')
    });
    socket.on('TF1off', function () {
        client.publish('/EM330/shelly25/1off', 'off')
    });
    socket.on('ACon', function () {
        client.publish('/EM330/sensibo/ON')
    });

    socket.on('ACoff', function () {
        client.publish('/EM330/sensibo/OFF')
    });
    socket.on('btnSW', function (num) {
        sendflag = num;
    })
});





// (EMPowernows[EMPowernows.length - 1].createdAt.getYear() + 1900) + "-" +
//         (EMPowernows[EMPowernows.length - 1].createdAt.getMonth() + 1) + "-" +
//         EMPowernows[EMPowernows.length - 1].createdAt.getDate() + " " ;