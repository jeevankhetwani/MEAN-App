/**
 * Created by jeevan on 7/16/17.
 */
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const conf = require('../conf/db');


// register
router.post('/register', (req, res, next) => {

    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
    });

    User.addUser(newUser, (err) => {
        if(err)
            res.json({ success: false, msg: 'failed to register'});
        else
            res.json({ success: true, msg: 'user registered'});
    });
});

router.post('/authenticate', (req, res, next) => {

    let username = req.body.username;
    let password = req.body.password;

    User.getUserByUsername(username, (err, user) => {

        if(err) throw err;

        if(!user)
            return res.json({success: false, msg: 'user not found'});

        User.matchPassword(password, user.password, (err, isMatch) => {

            if(err) throw err;

            if(!isMatch)
                return res.json({success: false, msg: 'invalid password'});

            let token = jwt.sign(user, conf.secret, {
                expiresIn: 604800 // 1 week
            });

            res.json({
                success: true,
                token: 'JWT ' + token,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email
                }
            });

        });
    });
});

router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
    res.json({user: req.user});
});

module.exports = router;