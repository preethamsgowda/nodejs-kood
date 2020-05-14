let mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
      }, 
    firstName: {
        type: String,
        required: true
      },
    lastName: {
        type: String,
        required: true
      },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
}, {collection: 'users'});

var User = mongoose.model('user', userSchema);

module.exports = User;