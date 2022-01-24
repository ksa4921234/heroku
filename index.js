const express = require('express');
const path = require('path');
const app = new express();
const ejs = require('ejs');
const mongoose = require('mongoose');

const EMPower_now = require('./models/EMPower_now.js')
const EMPower_tenmin = require('./models/EMPower_temin.js')
const EMPower_thirtymin = require('./models/EMPower_thirtymin.js')
const EMPower_hour = require('./models/EMPower_hour.js')
const EMPower_day = require('./models/EMPower_day.js')
const TFPower_now = require('./models/TFPower_now.js')
const TFPower_tenmin = require('./models/TFPower_temin.js')
const TFPower_thirtymin = require('./models/TFPower_thirtymin.js')
const TFPower_hour = require('./models/TFPower_hour.js')
const TFPower_day = require('./models/TFPower_day.js')
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
    const EMPower_now_find = await EMPower_now.find({})
    const EMPower_tenmin_find = await EMPower_tenmin.find({})
    const EMPower_thirtymin_find = await EMPower_thirtymin.find({})
    const EMPower_hour_find = await EMPower_hour.find({})
    const EMPower_day_find = await EMPower_day.find({})
    const TFPower_now_find = await TFPower_now.find({})
    const TFPower_tenmin_find = await TFPower_tenmin.find({})
    const TFPower_thirtymin_find = await TFPower_thirtymin.find({})
    const TFPower_hour_find = await TFPower_hour.find({})
    const TFPower_day_find = await TFPower_day.find({})
    const ACPosts = await ACPost.find({})
    //EM當下
    var EM_now_watt = EMPower_now_find[EMPower_now_find.length - 1].功率;
    var EM_now_volt = EMPower_now_find[EMPower_now_find.length - 1].電壓;
    var EM_now_date =
        EMPower_now_find[EMPower_now_find.length - 1].createdAt.getHours() + ":" +
        EMPower_now_find[EMPower_now_find.length - 1].createdAt.getMinutes();
    //EM十分鐘
    var EM_tenmin_arg_watt = [],
        EM_tenmin_total_watt = [],
        EM_tenmin_date = [];
    for (i = EMPower_tenmin_find.length - 7; i < EMPower_tenmin_find.length; i++) {
        EM_tenmin_arg_watt.push(EMPower_tenmin_find[i].十分鐘平均功率);
        EM_tenmin_total_watt.push((EMPower_tenmin_find[i].十分鐘總共功率 / 1000).toFixed(2));
        EM_tenmin_date.push(EMPower_tenmin_find[i].createdAt.getHours() + ":" + EMPower_tenmin_find[i].createdAt.getMinutes());
    }
    EM_tenmin_arg_watt = JSON.stringify(EM_tenmin_arg_watt);
    EM_tenmin_total_watt = JSON.stringify(EM_tenmin_total_watt);
    EM_tenmin_date = JSON.stringify(EM_tenmin_date);
    //EM半小時
    var EM_thirtymin_arg_watt = [],
        EM_thirtymin_total_watt = [],
        EM_thirtymin_date = [];
    EM_thirtymin_arg_watt[0] = EMPower_thirtymin_find[0].長時間平均功率;
    EM_thirtymin_total_watt[0] = (EMPower_thirtymin_find[0].長時間總共功率 / 1000).toFixed(2);
    EM_thirtymin_date[0] = EMPower_thirtymin_find[0].createdAt.getDate() + "日";
    for (i = 1; i < EMPower_thirtymin_find.length; i++) {
        EM_thirtymin_arg_watt[i] = EMPower_thirtymin_find[i].長時間平均功率;
        EM_thirtymin_total_watt[i] = (EMPower_thirtymin_find[i].長時間總共功率 / 1000).toFixed(2);
        EM_thirtymin_date[i] = "";
    }
    EM_thirtymin_arg_watt[EMPower_thirtymin_find.length] = EMPower_thirtymin_find[EMPower_thirtymin_find.length - 1].長時間平均功率;
    EM_thirtymin_total_watt[EMPower_thirtymin_find.length] = (EMPower_thirtymin_find[EMPower_thirtymin_find.length - 1].長時間總共功率 / 1000).toFixed(2);
    EM_thirtymin_date[EMPower_thirtymin_find.length] = EMPower_thirtymin_find[EMPower_thirtymin_find.length - 1].createdAt.getDate() + "日";
    EM_thirtymin_arg_watt = JSON.stringify(EM_thirtymin_arg_watt);
    EM_thirtymin_total_watt = JSON.stringify(EM_thirtymin_total_watt);
    EM_thirtymin_date = JSON.stringify(EM_thirtymin_date);
    //EM一小時
    var EM_hour_arg_watt = [],
        EM_hour_total_watt = [],
        EM_hour_date = [];
    if (EMPower_hour_find.length >= 24) {
        for (i = EMPower_hour_find.length - 24; i < EMPower_hour_find.length; i++) {
            EM_hour_arg_watt.push(EMPower_hour_find[i].小時平均功率);
            EM_hour_total_watt.push((EMPower_hour_find[i].小時總共功率 / 1000).toFixed(2));
            EM_hour_date.push(EMPower_hour_find[i].createdAt.getDate() + "日" + EMPower_hour_find[i].createdAt.getHours() + "時");
        }
    } else {
        for (i = 0; i < 24; i++) {
            EM_hour_arg_watt.push(0);
            EM_hour_total_watt.push(0);
            EM_hour_date.push("No Data on Server!");
        }
    }
    EM_hour_arg_watt = JSON.stringify(EM_hour_arg_watt);
    EM_hour_total_watt = JSON.stringify(EM_hour_total_watt);
    EM_hour_date = JSON.stringify(EM_hour_date);
    //TF當下
    var TF_now_watt = TFPower_now_find[TFPower_now_find.length - 1].功率;
    var TF_now_volt = TFPower_now_find[TFPower_now_find.length - 1].電壓;
    var TF_now_date =
        TFPower_now_find[TFPower_now_find.length - 1].createdAt.getHours() + ":" +
        TFPower_now_find[TFPower_now_find.length - 1].createdAt.getMinutes();
    //TF十分鐘
    var TF_tenmin_arg_watt = [],
        TF_tenmin_total_watt = [];
    for (i = TFPower_tenmin_find.length - 7; i < TFPower_tenmin_find.length; i++) {
        TF_tenmin_arg_watt.push(TFPower_tenmin_find[i].十分鐘平均功率);
        TF_tenmin_total_watt.push((TFPower_tenmin_find[i].十分鐘總共功率 / 1000).toFixed(2));
    }
    TF_tenmin_arg_watt = JSON.stringify(TF_tenmin_arg_watt);
    TF_tenmin_total_watt = JSON.stringify(TF_tenmin_total_watt);
    //TF半小時
    var TF_thirtymin_arg_watt = [],
        TF_thirtymin_total_watt = [];
    TF_thirtymin_arg_watt[0] = TFPower_thirtymin_find[0].長時間平均功率;
    TF_thirtymin_total_watt[0] = (TFPower_thirtymin_find[0].長時間總共功率 / 1000).toFixed(2);
    for (i = 1; i < TFPower_thirtymin_find.length; i++) {
        TF_thirtymin_arg_watt[i] = TFPower_thirtymin_find[i].長時間平均功率;
        TF_thirtymin_total_watt[i] = (TFPower_thirtymin_find[i].長時間總共功率 / 1000).toFixed(2);
    }
    TF_thirtymin_arg_watt[TFPower_thirtymin_find.length] = TFPower_thirtymin_find[TFPower_thirtymin_find.length - 1].長時間平均功率;
    TF_thirtymin_total_watt[TFPower_thirtymin_find.length] = (TFPower_thirtymin_find[TFPower_thirtymin_find.length - 1].長時間總共功率 / 1000).toFixed(2);
    TF_thirtymin_arg_watt = JSON.stringify(TF_thirtymin_arg_watt);
    TF_thirtymin_total_watt = JSON.stringify(TF_thirtymin_total_watt);
    //TF小時
    var TF_hour_arg_watt = [],
        TF_hour_total_watt = [];
    if (TFPower_hour_find.length >= 24) {
        for (i = TFPower_hour_find.length - 24; i < TFPower_hour_find.length; i++) {
            TF_hour_arg_watt.push(TFPower_hour_find[i].小時平均功率);
            TF_hour_total_watt.push((TFPower_hour_find[i].小時總共功率 / 1000).toFixed(2));
        }
    } else {
        for (i = 0; i < 24; i++) {
            TF_hour_arg_watt.push(0);
            TF_hour_total_watt.push(0);
        }
    }
    TF_hour_arg_watt = JSON.stringify(TF_hour_arg_watt);
    TF_hour_total_watt = JSON.stringify(TF_hour_total_watt);
    var AC_tmp = ACPosts[ACPosts.length - 1].溫度;
    var AC_hum = ACPosts[ACPosts.length - 1].濕度;
    var now_send_first,
        now_send_second,
        now_send_third,
        now_send_four,
        now_send_five;
    if (sendflag == 0) {
        now_send_first = "當前用電量ShellyEM";
        now_send_second = "Watt";
        if (EM_now_watt > 1000) now_send_third = (EM_now_watt / 1000).toFixed(2) + " kw";
        else now_send_third = EM_now_watt + " w";
        now_send_four = "Voltage";
        now_send_five = EM_now_volt + " V";
    } else if (sendflag == 1) {
        now_send_first = "當前用電量Shelly25";
        now_send_second = "Watt";
        now_send_third = TF_now_watt + " w";
        now_send_four = "Voltage";
        now_send_five = TF_now_volt + " V";
    } else if (sendflag == 2) {
        now_send_first = "當前冷氣狀態";
        now_send_second = "溫度";
        now_send_third = AC_tmp + " 度";
        now_send_four = "濕度";
        now_send_five = AC_hum + " %";
    }

    res.render('index', {
        EMPower_now_ejs: EMPower_now_find,
        EM_now_watt_ejs: EM_now_watt,
        EM_now_date_ejs: EM_now_date,
        EM_tenmin_arg_watt_ejs: EM_tenmin_arg_watt,
        EM_tenmin_total_watt_ejs: EM_tenmin_total_watt,
        EM_thirtymin_arg_watt_ejs: EM_thirtymin_arg_watt,
        EM_thirtymin_total_watt_ejs: EM_thirtymin_total_watt,
        EM_thirtymin_date_ejs: EM_thirtymin_date,
        EM_tenmin_date_ejs: EM_tenmin_date,
        EM_hour_arg_watt_ejs: EM_hour_arg_watt,
        EM_hour_total_watt_ejs: EM_hour_total_watt,
        EM_hour_date_ejs: EM_hour_date,

        TFPower_now_ejs: TFPower_now_find,
        TF_now_watt_ejs: TF_now_watt,
        TF_now_date_ejs: TF_now_date,
        TF_tenmin_arg_watt_ejs: TF_tenmin_arg_watt,
        TF_tenmin_total_watt_ejs: TF_tenmin_total_watt,
        TF_thirtymin_arg_watt_ejs: TF_thirtymin_arg_watt,
        TF_thirtymin_total_watt_ejs: TF_thirtymin_total_watt,
        TF_hour_arg_watt_ejs: TF_hour_arg_watt,
        TF_hour_total_watt_ejs: TF_hour_total_watt,

        AC_tmp_ejs: AC_tmp,
        AC_hum_ejs: AC_hum,

        now_send_first_ejs: now_send_first,
        now_send_second_ejs: now_send_second,
        now_send_third_ejs: now_send_third,
        now_send_four_ejs: now_send_four,
        now_send_five_ejs: now_send_five
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