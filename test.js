const mongoose = require('mongoose')
const BlogPost = require('./models/BlogPost')

mongoose.connect('mongodb://localhost/my_database',{useNewUrlParser:true});

BlogPost.create({
    title:'Hello world!!!',
    body:'NONONONONONONO'
},(error,blogpost)=>{
    console.log(error,blogpost)
})