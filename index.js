/* eslint-disable no-mixed-spaces-and-tabs */
/* eslint-disable no-undef */
const express = require('express');
const app = express();
const path = require('path');
const dbHelper = require('./dbHelper');
const bodyParser = require('body-parser');

const port = 3002;

var jsonParser = bodyParser.json();


app.get('/loaderio-13f8d0d532bc3920ce4ba4ee73f2a0b5/', (req, res) => {
  res.sendFile(path.join(__dirname, 'loaderio-13f8d0d532bc3920ce4ba4ee73f2a0b5.txt'));
});

app.get('/reviews/:product_id/meta', (req, res) => {
  let pID = req.params.product_id;
  dbHelper.getMeta(pID, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(data);
    }
  });
});

app.get('/reviews/:product_id/sort/:sort', (req, res) => {
  let pID = req.params.product_id;
  let sort = req.params.sort;
  dbHelper.getReviews(pID, sort, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(data);
    }
  });
});

app.get('/reviews/:product_id/ratings', (req, res) => {
  let pID = req.params.product_id;
  dbHelper.getRatings(pID, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(data);
    }
  });
});

app.get('/reviews/:product_id/characteristics', (req, res) => {
  let pID = req.params.product_id;
  dbHelper.getCharacteristics(pID, (err, data) => {
    if (err) {
      throw err;
    } else {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.json(data);
    }
  });
});

app.put('/reviews/helpful/:review_id', (req, res) => {
  let rID = req.params.review_id;
  dbHelper.markHelpful(rID, (err) => {
    if (err) {
      res.setHeader('Access-Control-Allow-Origin', '*');
	    res.sendStatus(501);
    } else {
	    res.setHeader('Access-Control-Allow-Origin', '*');
      res.sendStatus(204);
    }
  });
});

app.put('/reviews/report/:review_id', (req, res) => {
  let rID = req.params.review_id;
  dbHelper.report(rID, (err) => {
    if (err) {
	    res.setHeader('Access-Control-Allow-Origin', '*');
      res.sendStatus(501);
    } else {
	    res.setHeader('Access-Control-Allow-Origin', '*');
      res.sendStatus(204);
    }
  });
});

app.post('/reviews/:product_id', jsonParser, (req, res) => {
  let pID = req.params.product_id;
  dbHelper.addReview(pID, req.body.review, (err) => {
    if (err) {
	    res.setHeader('Access-Control-Allow-Origin', '*');
      res.sendStatus(501);
    } else {
	    res.setHeader('Access-Control-Allow-Origin', '*');
      res.sendStatus(204);
    }
  });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
