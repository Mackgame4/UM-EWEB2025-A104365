const express = require('express');
const router = express.Router();
const axios = require('axios');
const { defaultImports, isLoggedIn } = require('../utils.cjs');

/* GET home page */
router.get('/', isLoggedIn, function(req, res, _) {
    axios.get('http://localhost:3001/journals')
      .then(response => {
        const journals = response.data;
        if (response.status !== 200) {
          throw new Error('Failed to fetch journals');
        }
        res.render('index', { title: 'Journals', journals: journals, ...defaultImports(req) });
      })
      .catch(err => {
        console.error('Error fetching journals:', err);
      });
});

/* GET /login - render login page */
router.get('/login', function(req, res, _) {
  res.render('users/login', { title: 'Log In', layout: 'no-layout', messages: { success: req.flash('success'), error: req.flash('error') } });
});

/* GET /signup - render signup page */
router.get('/signup', function(req, res, _) {
  res.render('users/signup', { title: 'Sign Up', layout: 'no-layout', messages: { success: req.flash('success'), error: req.flash('error') } });
});

/* GET /account - render user account page */
router.get('/account', isLoggedIn, function(req, res, _) {
  const section = req.query.section || null;
  res.render('users/account', { title: 'My Account', section, ...defaultImports(req) });
});

module.exports = router;
