/* eslint-disable camelcase */
/* eslint-disable no-undef */
const db = require('./sqlConfig');


module.exports = {
  getMeta: function(productId, callback) {
    let results = {};
    let ratings = {
      '1': 0,
      '2': 0,
      '3': 0,
      '4': 0,
      '5': 0
    };
    let characteristics = {};
    results.product_id = productId.toString();
    db.queryAsync(`SELECT COUNT(*) FROM allReviews WHERE product_id=${productId} AND recommend=1`)
      .then((result) => {
        results.recommended = { 0: result[0][0]['COUNT(*)']};
        return db.queryAsync(`SELECT rating FROM allReviews WHERE product_id=${productId}`);
      })
      .then((rates) => {
        rates[0].map((rate) => {
          ratings[rate.rating.toString()] += 1;
        });
        results.ratings = ratings;
        return db.queryAsync(`SELECT c.*, cR.* FROM characteristics as c INNER JOIN characteristicsReviews as cR ON c.characteristic_id = cR.characteristic_id WHERE c.product_id=${productId};`);
      })
      .then((allChars) => {
        let count = 0;
        let total = 0;
        characteristics[allChars[0][0].name] = {'id': allChars[0][0].characteristic_id, 'value': 0};
        allChars[0].map((aChar, i) => {
          if (characteristics[aChar.name] === undefined) {
            let finalVal = total / count;
            characteristics[allChars[0][i - 1].name].value = finalVal;
            count = 0;
            total = 0;
            characteristics[aChar.name] = {'id': aChar.characteristic_id, 'value': 0};
            count++;
            total += aChar.value;
          } else if (i === allChars[0].length - 1) {
            count++;
            total += aChar.value;
            let finalVal = total / count;
            characteristics[allChars[0][i].name].value = finalVal;
          } else {
            count++;
            total += aChar.value;
          }
        });
        results.characteristics = characteristics;
        callback(null, results);
      })
      .error(error => {
        callback(error, results);
      });
  },

  getReviews: function(productId, sort, callback) {
    let results = {};
    let sortBy = '';
    if (sort === 'helpful') {
      sortBy = 'helpfulness';
    } else if (sort === 'newest') {
      sortBy = 'date_added';
    } else {
      // eslint-disable-next-line quotes
      sortBy = `helpfulness,date`;
    }
    results.product_id = productId.toString();
    db.queryAsync(`SELECT review_id,rating,date_added,summary,body,recommend,reviewer_name,response,helpfulness FROM allReviews WHERE product_id=${productId} AND reported=0 ORDER BY ${sortBy} DESC`)
      .then((result) => { 
        results.results = result[0];
        return db.queryAsync(` SELECT p.*, a.product_id FROM photos as p INNER JOIN allReviews as a ON p.review_id = a.review_id WHERE a.product_id=${productId};`);
      })
      .then((allPhotos) => {
        results.results.map((review) => {
          review.photos = [];
          allPhotos[0].map(photo => {
            if (review.review_id === photo.review_id) {
              let aPhoto = {'id': photo.id, 'url': photo.url};
              review.photos.push(aPhoto);
            }
          });
        });
        callback(null, results);
      })
      .error(error => {
        callback(error, results);
      });
  },

  markHelpful: function(reviewId, callback) {
    db.queryAsync(`UPDATE allReviews SET helpfulness = helpfulness + 1 WHERE review_id=${reviewId}`)
      .then(() => {
        callback(null);
      })
      .error(error => {
        callback(error);
      });
  },

  report: function(reviewId, callback) {
    db.queryAsync(`UPDATE allReviews SET reported=1 WHERE review_id=${reviewId}`)
      .then(() => {
        callback(null);
      })
      .error(error => {
        callback(error);
      });
  },

  addReview: function(productId, review, callback) {
    console.log(review);
    db.queryAsync(`INSERT INTO allReviews (product_id, rating, date_added, summary, body, recommend, reported, reviewer_name, reviewer_email, response, helpfulness) VALUES (${productId}, ${review.rating}, ${review.date}, ${review.summary}, ${review.body}, ${review.recommend}, 0, ${review.reviewer_name}, ${review.reviewer_email}, null, 0)`)
      .then(() => {
        if (review.photos.length > 0) {
          console.log('meow');
          return db.queryAsync('SELECT MAX(review_id) FROM allReviews');
        } else {
          callback(null);
        }
      })
      .then((result) => {
        console.log(result);
        return db.queryAsync(` INSERT INTO photos(review_id, url) VALUES (${result[0][0]}, ${review.photos[0].url}`);
      })
      .then(() => {
        callback(null);
      })
      .error(error => {
        console.log('errormeow');
        callback(error);
      });
  }
};