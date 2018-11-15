const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  name:{
    type:String,
    required:true,
  },
  password:{
    type:String,
    required:true,
  },
  content:{
    type:String,
    required:true,
  },
  regdate:{
    type:Date,
    default:Date.now()
  },
  rereply:[]
});


const Reply = mongoose.model('reply', ReplySchema)
module.exports = Reply;