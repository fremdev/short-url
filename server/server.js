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

app.get('/new/:url(*)', (req, res) => {
  const longUrl = req.params.url;

  if(validator.isURL(longUrl, {require_protocol: true})) {
    const shortUrl = shortid.generate();

    MongoClient.connect(mongoUri, (err, db) => {
      if(err) {
        return console.log('Unable to connect to Mongodb server');
      }
      console.log('Connected to MongoDB server');

      db.collection('Links').findOne({original: longUrl}).then((doc) => {
        if(doc) {
          res.send({original: doc.original, short: doc.short});
          db.close();
        } else {
          const newLink = {
            original: longUrl,
            short: shortUrl
          };
          db.collection('Links').insertOne(newLink).then((doc) => {
            console.log('Link was successfully added');
            res.send({original: newLink.original, short: newLink.short});
            db.close();
          }, (err) => {
            console.log('Unable to insert link', err);
          });
        }
      }, (err) => {
        console.log('Unable to fetch data');
      });

    });
  } else {
    res.send({error: 'Wrong url format, make sure you have a valid protocol and real site.'});
  }
});

app.get('/:short', (req, res) => {
  const shortUrl = req.params.short;

  MongoClient.connect(mongoUri, (err, db) => {
    if(err) {
      return console.log('Unable to connect to Mongodb server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Links').findOne({short: shortUrl}).then((doc) => {
      if(doc) {
        res.redirect(doc.original);
      } else {
        res.send({error: 'This url is not on the database.'});
      }
    }, (err) => {
      console.log('Unable to fetch data');
    });

    db.close();
  });
});

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
