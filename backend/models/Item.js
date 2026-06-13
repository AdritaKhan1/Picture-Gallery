'use strict';

const mongoose = require('mongoose');

// file upload including name, info, and the pic itself, info not required.
const ItemSchema = new mongoose.Schema({
  title: {
    type:     String,
    required: true,
    trim:     true
  },
  info: {
    type:     String,
    required: false,
    trim:     true,
    default:  ''
  },
  image: {    
    type:     String,
    required: true
  }
});

const Item = mongoose.model('item', ItemSchema);
module.exports = Item;
