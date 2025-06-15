var express = require('express');
var router = express.Router();
var edicoesController = require('../controllers/edicoes');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/allData', function(req, res, next) {
    edicoesController.list()
        .then(edicoes => {
            if (edicoes.length > 0) {
                res.json(edicoes);
            } else {
                res.status(404).json({ error: 'No edicoes found.' });
            }
        })
        .catch(err => {
            console.error('Error finding edicoes:', err);
            res.status(500).json({ error: 'Error finding edicoes!' });
        });
});

module.exports = router;
