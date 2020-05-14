const bcrypt = require('bcrypt');

let saltRounds = 10;

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash('sample_password_here', salt, function(err, hash) {
        console.log('hash: ', hash);
    });
});