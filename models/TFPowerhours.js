const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PowerSchema = new Schema({
    小時平均功率: Number,
    小時總共功率: Number,
    createdAt: Date
});

const TFPowerhour = mongoose.model('shellytf/hours',PowerSchema);

module.exports=TFPowerhour