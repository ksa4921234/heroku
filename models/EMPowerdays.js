const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PowerSchema = new Schema({
    功率: Number,
    createdAt: Date
});

const EMPowerday = mongoose.model('shellyem/days',PowerSchema);

module.exports=EMPowerday