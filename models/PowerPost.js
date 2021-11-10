const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PowerSchema = new Schema({
    WATT: Number,
    createdAt:String
});

const PowerPost = mongoose.model('1minkeep',PowerSchema);
module.exports=PowerPost