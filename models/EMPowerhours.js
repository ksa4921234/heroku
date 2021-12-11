const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PowerSchema = new Schema({
    功率: Number,
    createdAt: Date
});

const EMPowerhour = mongoose.model('shellyem/hours',PowerSchema);

module.exports=EMPowerhour