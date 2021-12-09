// Create a MQTT Client
var mqtt = require('mqtt');
var opt = {
  port:1883,
  clientId: 'nodejs'
};

let http = require("http")
// var io = require("socket.io");
var io = require('socket.io')(server);
var express = require("express");
var app = express();
app.use(express.static('www'));
var server = app.listen(4000);
console.log('已打開伺服器');

var client  = mqtt.connect('mqtt://192.168.1.230' , {
    username: 'kevin01',
    password: '0101xx' 
});

var sio = io.listen(server);

client.on('connect', function () {
console.log('已連接至MQTT伺服器');
client.subscribe("/room_temp");
});

//傳訊息給mqtt 

client.publish('presence', '68666')

client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    client.end()
  })
