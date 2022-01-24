const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PowerSchema = new Schema({
    小時平均功率: Number,
    小時總共功率:Number,
    createdAt: Date
});

const EMPowerhour = mongoose.model('shellyem/hours',PowerSchema);

module.exports=EMPowerhour