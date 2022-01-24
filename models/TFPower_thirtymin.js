const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PowerSchema = new Schema({
    長時間平均功率:Number,
    長時間總共功率: Number,
    createdAt: Date
});

const TFPoweryear = mongoose.model('shellytf/years',PowerSchema);

module.exports=TFPoweryear