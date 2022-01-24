const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PowerSchema = new Schema({
    十分鐘平均功率: Number,
    十分鐘總共功率:Number,
    createdAt: Date
});

const EMPowertenmin = mongoose.model('shellyem/tenmins',PowerSchema);

module.exports=EMPowertenmin