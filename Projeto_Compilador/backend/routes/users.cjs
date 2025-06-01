const express = require('express');
const router = express.Router();
const usersController = require('../controllers/user.cjs');

/* GET /users - return a list of users */
router.get('/', (_, res) => {
  usersController.findAll()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Error fetching users.', error: err });
    });
});

/* GET /users/:id - return a user by ID */
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  usersController.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
      res.status(200).json(user);
    })
    .catch(err => {
      console.error('Error fetching user by ID:', err);
      res.status(500).json({ message: 'Error fetching user by ID.', error: err });
    });
});

/* POST /users/verify - verify user credentials  */
router.post('/verify', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required!' });
  }
  usersController.findOne({ email })
    .then(user => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      return res.status(200).json({ user });
    })
    .catch(err => {
      console.error('Verification error:', err);
      return res.status(500).json({ 
        message: 'Authentication error',
        error: err 
      });
    });
});

/* POST /users/create - create a new user */
router.post('/create', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(201).json({ message: 'Username, email, and password are required!' });
  }
  usersController.save({ username, email, password })
    .then(newUser => {
      return res.status(200).json({ message: 'User created successfully!', user: newUser });
    })
    .catch(err => {
      console.error('Error creating user:', err);
      return res.status(500).json({ message: 'Error creating user.', error: err });
    });
});

/* POST /users/change-password - change user password */
router.post('/change-password', (req, res) => {
  const { oldPassword, newPassword, userId } = req.body;
  if (!userId) {
    return res.status(201).json({ message: 'User ID is required!' });
  }
  if (!oldPassword || !newPassword) {
    return res.status(201).json({ message: 'Current password and new password are required!' });
  }
  usersController.update(userId, { password: newPassword })
    .then(updatedUser => {
      return res.status(200).json({ message: 'Password updated successfully!', user: updatedUser });
    })
    .catch(err => {
      console.error('Error updating password:', err);
      return res.status(500).json({ message: 'Error updating password.', error: err });
    });
});

/* POST /users/change-username - change user username */
router.post('/change-username', (req, res) => {
  const { username, userId } = req.body;
  if (!userId || !username) {
    return res.status(201).json({ message: 'User ID and username are required!' });
  }
  usersController.update(userId, { username })
    .then(updatedUser => {
      return res.status(200).json({ message: 'Username updated successfully!', user: updatedUser });
    })
    .catch(err => {
      console.error('Error updating username:', err);
      return res.status(500).json({ message: 'Error updating username', error: err });
    });
});

/* POST /users/delete - delete user account */
router.post('/delete', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }
  usersController.delete(userId)
    .then(() => {
      return res.status(200).json({ message: 'User deleted successfully!' });
    })
    .catch(err => {
      console.error('Error deleting user:', err);
      return res.status(500).json({ 
        message: err.message || 'Error deleting user',
        error: err 
      });
    });
});

module.exports = router;