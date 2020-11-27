const mongoose = require('mongoose');
const urlSchema = require('./url-schema');

const urlModel = mongoose.model('Url', urlSchema);

module.exports = urlModel;