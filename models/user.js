/**
 * Created by jeevan on 7/16/17.
 */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const conf = require('../conf/db');

// user schema
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const User = module.exports = mongoose.model('User', userSchema);

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

module.exports.getUserByUsername = function(username, callback) {
    let query = { username: username };
    User.findOne(query, callback);
};

module.exports.addUser = function (newUser, callback) {

    bcrypt.genSalt(10, (err, salt) => {

        if(err) throw err;

        bcrypt.hash(newUser.password, salt, (err, hash) => {

            if(err) throw err;

            newUser.password = hash;

            newUser.save(callback);
        });
    });
};

module.exports.matchPassword = function(password, hash, callback) {

    bcrypt.compare(password, hash, (err, isMatch) => {

        if(err) throw err;

        callback(null, isMatch);
    });
};


