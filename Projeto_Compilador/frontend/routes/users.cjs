const express = require('express');
const router = express.Router();
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const axios = require('axios');

// Set up passport for local authentication
passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, async (email, password, done) => {
    try {
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      const response = await axios.post('http://localhost:3001/users/verify', {
        email,
        password: hashedPassword
      });
      if (response.status === 404) {
        return done(null, false, { message: 'Account not found' });
      }
      if (response.status === 401) {
        return done(null, false, { message: 'Invalid password' });
      }
      if (response.status !== 200) {
        return done(null, false, { message: 'Authentication failed' });
      }
      return done(null, response.data.user);
    } catch (err) {
      if (err.response) {
        return done(null, false, { 
          message: err.response.data?.message || 'Authentication failed' 
        });
      }
      return done(err);
    }
  }
));

passport.serializeUser((user, cb) => {
  cb(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const response = await axios.get(`http://localhost:3001/users/${id}`);
    if (response.status === 404) {
      return done(new Error('User no longer exists'));
    }
    return done(null, response.data);
  } catch (err) {
    if (err.response?.status === 404) {
      return done(new Error('User not found'));
    }
    return done(err);
  }
});

/* POST /users/login - log in a user */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', info.message || 'Login failed.');
      return res.redirect('/login');
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.redirect('/'); // Redirect to home page after successful login
    });
  })(req, res, next);
});

/* POST /users/logout - log out the user */
router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    return res.redirect('/login');
  });
});

/* POST /users/signup - create a new user */
router.post('/signup', (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
  if (!username || !email || !password) {
    return req.flash('error', 'Username, email, and password are required!');
  }
  axios.post('http://localhost:3001/users/create', { username, email, password: hashedPassword })
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Failed to create user');
      }
      req.flash('success', 'User created successfully!');
      return res.redirect('/login');
    })
    .catch(err => {
      console.error('Error creating user:', err);
      req.flash('error', 'Error creating user.');
      return res.redirect('/signup');
    });
});

/* POST /users/change-password - change user password */
router.post('/change-password', (req, res) => {
  const user = req.user;
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    req.flash('error', 'Current password and new password are required!');
    return res.redirect('/account?section=password');
  }
  console.log('Changing password for user:', user);
  const oldHashedPassword = crypto.createHash('sha256').update(currentPassword).digest('hex');
  const newHashedPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
  if (oldHashedPassword !== user.password) { // This should be done by the server
    req.flash('error', 'Current password is incorrect!');
    return res.redirect('/account?section=password');
  }
  axios.post('http://localhost:3001/users/change-password', { userId: user._id, oldPassword: oldHashedPassword, newPassword: newHashedPassword })
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Failed to change password');
      }
      req.flash('success', 'Password updated successfully!');
      return res.redirect('/account?section=password');
    })
    .catch(err => {
      console.error('Error updating password:', err);
      req.flash('error', 'Error updating password');
      return res.redirect('/account?section=password');
    });
});

/* POST /users/change-username - change user username */
router.post('/change-username', (req, res) => {
  const user = req.user;
  const { username } = req.body;
  axios.post('http://localhost:3001/users/change-username', { username, userId: user._id })
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Failed to change username');
      }
      req.flash('success', 'Username updated successfully!');
      return res.redirect('/account?section=username');
    })
    .catch(err => {
      console.error('Error updating username:', err);
      req.flash('error', 'Error updating username');
      return res.redirect('/account?section=username');
    });
});

/* POST /users/delete - delete user account */
router.post('/delete', (req, res) => {
  const user = req.user;
  if (!user || !user._id) {
    req.flash('error', 'No authenticated user found!');
    return res.redirect('/account');
  }
  axios.post('http://localhost:3001/users/delete', { userId: user._id })
    .then(response => {
      if (response.status !== 200) {
        throw new Error('Failed to delete account');
      }
      req.logout(err => {
        if (err) {
          console.error('Logout error:', err);
          req.flash('error', 'Error during logout');
          return res.redirect('/account');
        }
        req.flash('success', 'Account deleted successfully');
        return res.redirect('/login');
      });
    })
    .catch(err => {
      console.error('Delete error:', err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || 'Failed to delete account';
      req.flash('error', errorMsg);
      return res.redirect('/account');
    });
});

module.exports = router;
