const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PowerSchema = new Schema({
    一天平均功率: Number,
    一天總共功率: Number,
    createdAt: Date
});

const EMPowerday = mongoose.model('shellyem/days',PowerSchema);

module.exports=EMPowerday