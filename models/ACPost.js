const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PowerSchema = new Schema({
    溫度: Number,
    濕度:Number,
    createdAt: Date
});

const ACPost = mongoose.model('sensibo/acs',PowerSchema);

module.exports=ACPost