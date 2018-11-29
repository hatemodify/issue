const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({

  author: {
    type: String,
    default: '관리자'
  },
  tit: {
    type: String,
    unique: true,
    index: true
  },
  cont: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  reply: []
});

BoardSchema.virtual('createdDate').get(function() {
  return getDate(this.createdAt);
});

function getDate(dateObj) {
  if (dateObj instanceof Date)
    return (
      dateObj.getFullYear() +
      '-' +
      get2digits(dateObj.getMonth() + 1) +
      '-' +
      get2digits(dateObj.getDate())
    );
}

function get2digits(num) {
  return ('0' + num).slice(-2);
}

const Board = mongoose.model('board', BoardSchema);
module.exports = Board;
