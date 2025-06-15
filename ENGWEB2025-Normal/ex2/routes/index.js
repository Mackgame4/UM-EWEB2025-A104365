var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Express' });
  axios.get('http://localhost:25000/edicoes')
    .then(function (response) {
      res.render('index', { title: 'EurovisaoEweb', edicoes: response.data });
    })
    .catch(function (error) {
      console.error(error);
      res.status(500).send('Error fetching data from the API');
    });
});

router.get('/:id', function(req, res, next) {
  const id = req.params.id;
  axios.get(`http://localhost:25000/edicoes/${id}`)
    .then(function (response) {
      res.render('edicao', { title: 'EurovisaoEweb', edicao: response.data });
    })
    .catch(function (error) {
      console.error(error);
      res.status(404).send('Edicao not found');
    });
});

module.exports = router;
