/**
 * Created by jeevan on 7/16/17.
 */
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const conf = require('./conf/db');

// connect to db
mongoose.connect(conf.database);

let db = mongoose.connection;

// on connection
db.on('connected', () => console.log('Connected to db'));

// on error
db.on('error', (err) => console.log('Db error ' + err));



const app = express();
const port = 3000;

// allow req from cross origin CORS Middleware
app.use(cors());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./conf/passport')(passport);

const users = require('./routes/users');
app.use('/users', users);


// Index Route
app.get('/', (req, res) => {
    res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
    // res.redirect('/');
});



// start server
app.listen(port, () => console.log('Server listening on port ' + port));