const mongoose = require('mongoose');
const Schema = mongoose.Schema

const BlogPostSchema = new Schema({
    WATT: Number,
    createdAt:String
});

const BlogPost = mongoose.model('1minkeep',BlogPostSchema);
module.exports=BlogPost