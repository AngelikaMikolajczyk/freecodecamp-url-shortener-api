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
  const urlModel = new Url({_id: hash, originalUrl: url});

  urlModel.save(function(err, savedUrl){
    if(err) return done(err);
    done(null, savedUrl);
  })
}

// Cheched hash url in DB
function findUrlById(urlId, done) {
  Url.findById(urlId, function (err, foundUrl){
    if(err) return done(err);
    done(null, foundUrl);
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

  try{
    const url = new URL(originalUrl);
    dns.lookup(url.hostname, function(err){
      if(err) {
        res.json({error: 'invalid url'});
      } else {
        let hashedUrl = crypto.createHash('md5').update(originalUrl).digest('hex');
      
        findUrlById(hashedUrl, function(err, data){
          if(err){
            res.json({error: 'unexpected error'});
            return;
          }
          if(data !== null) {
            res.json({"original_url": data.originalUrl, "short_url": data._id});
          } else {
            createUrlAndSave(hashedUrl, originalUrl, function(err, data){
              if(err){
                res.json({error: 'unexpected error'});
                return;
              }
              res.json({"original_url": data.originalUrl, "short_url": data._id});
            })
          }
        })
      }
    })
  } catch(error) {
    res.json({error: 'invalid url'});
  }
  
})

app.get('/api/shorturl/:hashedUrl', function(req, res){
  findUrlById(req.params.hashedUrl, function(err, data){
    if(err){
      res.json({error: 'unexpected error'});
      return;
    }
    if(data === null){
      res.status(404).json({error: "url not found"});
      return;
    }
    res.redirect(data.originalUrl);
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
