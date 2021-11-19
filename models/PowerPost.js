const mongoose = require('mongoose');
const Schema = mongoose.Schema

const PowerSchema = new Schema({
    功率: Number,
    電壓: Number,
    已消耗功率: Number,
    createdAt: Date
});

const PowerPost = mongoose.model('10minkeep',PowerSchema);

module.exports=PowerPost