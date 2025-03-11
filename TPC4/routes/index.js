var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  const uc = {
    docente: 'DocenteName',
    instituicao: 'InstituicaoName',
  }
  res.render('index', { title: 'ExpressJS', uc }); // NOTE: This line renders the GET request to the index.pug file in the views folder (or in this case, any request coming to "/" route) (passes the variable to the route render function, in this case rendering index.pug)
});

module.exports = router;
