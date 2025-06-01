const User = require('../models/user.cjs');

module.exports.findAll = async () => {
    return await User.find()
        .then(users => {
            console.log('Users found successfully!');
            return users;
        })
        .catch(err => {
            console.error('Error finding users:', err);
            throw err;
        });
};

module.exports.findOne = async (filter) => {
    return await User.findOne(filter)
        .then(user => {
            console.log('User found successfully!');
            return user;
        })
        .catch(err => {
            console.error('Error finding user:', err);
            throw err;
        });
};

module.exports.findById = async (id) => {
    return await User.findById(id)
        .then(user => {
            console.log('User found by ID successfully!');
            return user;
        })
        .catch(err => {
            console.error('Error finding user by ID:', err);
            throw err;
        });
};

module.exports.save = async (user) => {
    const userDb = new User(user);
    return await userDb.save()
        .then(() => {
            console.log('User saved successfully!');
        })
        .catch(err => {
            console.error('Error saving user:', err);
            throw err;
        });
};

module.exports.delete = async (id) => {
    return await User.findByIdAndDelete(id)
        .then(() => {
            console.log('User deleted successfully!');
        })
        .catch(err => {
            console.error('Error deleting user:', err);
            throw err;
        });
};

module.exports.update = async (id, updateFields) => {
    return await User.findByIdAndUpdate(id, updateFields, { new: true })
        .then(updatedUser => {
            if (!updatedUser) {
                throw new Error('User not found for update');
            }
            console.log('User updated successfully!');
            return updatedUser;
        })
        .catch(err => {
            console.error('Error updating user:', err);
            throw err;
        });
};