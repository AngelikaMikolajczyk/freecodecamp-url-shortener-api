const UrlModel = require('./url-model');

// create document in DB function
function createUrlAndSave(hash, url, done) {
    const urlDocument = new UrlModel({_id: hash, originalUrl: url});
  
    urlDocument.save(function(err, savedUrl){
      if(err) return done(err);
      done(null, savedUrl);
    })
  }
  
// Cheched hash url in DB
function findUrlById(urlId, done) {
    UrlModel.findById(urlId, function (err, foundUrl){
      if(err) return done(err);
      done(null, foundUrl);
    })
  }

module.exports = {createUrlAndSave, findUrlById};
