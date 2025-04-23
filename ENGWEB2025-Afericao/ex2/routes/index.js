var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  axios.get('http://localhost:17000/books').then(function (response) {
    // handle success
    console.log(response.data);
    res.render('index', { title: 'ApiLivros', livros: response.data.items });
  }).catch(function (error) {
    // handle error
    console.log(error);
    res.render('index', { title: 'ApiLivros', livros: [] });
  });
});

module.exports = router;
