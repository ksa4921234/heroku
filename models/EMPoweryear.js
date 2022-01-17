const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PowerSchema = new Schema({
    長時間總共功率: Number,
    createdAt: Date
});

const EMPoweryear = mongoose.model('shellyem/years',PowerSchema);

module.exports=EMPoweryear