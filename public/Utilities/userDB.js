const mongoose = require('mongoose');
const User = require('../models/user');

let self = {};

// To get user object based on email id an password
// Temporarily returning a single user
self.findUser = (email, cb) => {
    User.findOne({
        email: email
    },
    (err, result) => {
        if (err) {
            console.error(err);
            cb(null);
        }
        else cb(result);
    })
};

module.exports = self;