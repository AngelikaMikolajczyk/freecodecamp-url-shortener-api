const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
    _id: {type: String, required: true},
    originalUrl: {type: String, required: true}
  })

module.exports = urlSchema;