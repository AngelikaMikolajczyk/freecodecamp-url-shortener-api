require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const mongoose = require('mongoose');

// DB Schema
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const urlSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  originalUrl: {type: String, required: true}
})

const Url = mongoose.model('Url', urlSchema);

// create document in DB function
function createUrlAndSave(hash, url, done) {
  const url = new Url({_id: hash, originalUrl: url});

  url.save(function(err, savedUrl){
    if(err) return err;
    done(null, savedUrl);
  })
}

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(bodyParser.urlencoded({extended: false}));

app.post('/api/shorturl/new', function(req, res){
  let originalUrl = req.body.url;

  // dns.lookup(originalUrl, function(err, address){
  //   console.log(err);
  //   if(err) {
  //     res.json({error: 'invalid url'});
  //   } else {
  //     res.json({"original_url": originalUrl})
  //   }
  // })
  
  let hashedUrl = crypto.createHash('md5').update(originalUrl).digest('hex');

  res.json({"original_url": originalUrl, "short_url": hashedUrl});
  
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
