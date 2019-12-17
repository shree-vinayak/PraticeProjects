const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const User = require("../models/user");

const db = "mongodb://localhost:27017/sociallogin";
mongoose.Promise = global.Promise;

mongoose.connect(db, { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log('error! ' + err);
    }
    else {
        console.log('connected successfully');
    }
});

router.post('/saveUser', function (req, res) {
    var newUser = new User();
    newUser.userId = req.body.userId;
    newUser.name = req.body.name;
    newUser.email = req.body.email;
    newUser.save(function (err, insertedUser) {
        if (err) {
            console.log('Error in saving user');
        }
        else {
            res.json(insertedUser);
        }
    });
});



router.get('/', function (req, res) {
    res.send('api works');
});


module.exports = router;