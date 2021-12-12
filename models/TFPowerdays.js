const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PowerSchema = new Schema({
    一天平均功率: Number,
    createdAt: Date
});

const TFPowerday = mongoose.model('shellytf/days',PowerSchema);

module.exports=TFPowerday