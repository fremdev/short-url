const path = require('path');
const express = require('express');
const validator = require('validator');
const shortid = require('shortid');
const {MongoClient} = require('mongodb');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/Shortener';
const app = express();

app.use(express.static(publicPath));

app.get('/new/:url(*)', function (req, res) {
  const longUrl = req.params.url;

  if(validator.isURL(longUrl)) {
    const shortUrl = shortid.generate();

    MongoClient.connect(mongoUri, (err, db) => {
      if(err) {
        return console.log('Unable to connect to Mongodb server');
      }
      console.log('Connected to MongoDB server');

      const newLink = {
        url: longUrl,
        short: shortUrl
      };

      db.collection('Links').insertOne(newLink).then((result) => {
        console.log('Link was successfully added');
        res.send(longUrl);
      }, (err) => {
        console.log('Unable to insert link');
      });

      db.close();
    });
  } else {
    res.send({error: 'Wrong url format, make sure you have a valid protocol and real site.'});
  }


});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
