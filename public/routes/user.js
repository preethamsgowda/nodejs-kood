const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const User = require('../models/user');
const userProfile = require('../Utilities/userProfileDB');
const userDB = require('../Utilities/userDB');

// Middleware to check if user has logged in for certain routes
const loginRequired = (req, res, next) => {
    if (req.session.userProfile) next();
    else res.redirect('/user/login'); // reroute to login page if the user has not logged in
}

// Render login page
router.get('/login', (req, res) => {

    // Parameters to display page title
    let pageParams = { title: 'Login | KooD' };
    res.render('login.ejs', {
        pageParams: pageParams,
        user: req.session.userProfile,
        errors: null
    });
});

// Perform login action using post method
router.post(
    '/login',
    [
        check('username')
            .isEmail()
            .normalizeEmail()
            .withMessage("Please enter a valid username, i.e an email id."),
        check('password')
            .isLength({ min: 6 })
            .trim()
            .escape()
            .withMessage("Invalid password length.")
    ],
    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Parameters to display page title
            let pageParams = { title: 'Login | KooD' };
            return res.render('login.ejs', {
                pageParams: pageParams,
                user: req.session.userProfile,
                errors: errors.array()
            });
        }

        let username = req.body['username'];
        let password = req.body['password'];

        // bcrypt.genSalt(saltRounds, function(err, salt) {
        //     bcrypt.hash(password, salt, function(err, hash) {
        //         console.log('hash: ', hash);
        //     });
        // });

        // bcrypt.compare(password, hash, function (err, result) {
        //     // result == true
        // });

        userDB.findUser(username, (result) => {

            if (result == null) {
                return res.render('login.ejs', {
                    pageParams: { title: 'Login | KooD' },
                    user: req.session.userProfile,
                    errors: [{ msg: "Username doesn't exist." }]
                });
            }

            bcrypt.compare(
                password,
                result.password,
                function (err, compareResult) {

                    if (compareResult != true) {
                        return res.render('login.ejs', {
                            pageParams: { title: 'Login | KooD' },
                            user: req.session.userProfile,
                            errors: [{ msg: "Invalid password." }]
                        });

                    } else {

                        //Adding user profile data to session
                        req.session.userProfile = result;
                        res.redirect('/user/connections');
                    }
                });
        });
    });

// Perform logout action
router.get('/logout', loginRequired, (req, res) => {

    req.session.userProfile = null; // resetting the session data
    res.redirect('/'); // redirecting to index page
});

// Perform action of adding a connection(i.e the rsvp) to userConnections with respective rsvp value
router.post(
    '/rsvp',
    [
        check('connection-id')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage("Invalid connection id"),
        check('rsvp-type')
            .isIn(['yes', 'no', 'maybe'])
            .withMessage("Invalid rsvp value")
    ],
    loginRequired,
    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.redirect('connections');
        }

        userProfile.addConnectionById(
        req.session.userProfile._id,
        req.body['connection-id'],
        req.body['rsvp-type'],
        (result) => {
            res.redirect('/user/connections'); // redirecting to my connections
        });
});

// Perform the action of deleting a connection(i.e the rsvp) from the userConnections
router.delete(
    '/rsvp',
    [
        check('connection-id')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage("Invalid connection id")
    ],
    loginRequired,
    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.redirect('connections');
        }

        userProfile.removeConnectionById(
        req.session.userProfile._id,
        req.body['connection-id'],
        (result) => {
            res.redirect('/user/connections'); // redirecting to my connections
        });
});

// Perform the action of updating a rsvp to the userConnection
router.put(
    '/rsvp',
    [
        check('connection-id')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage("Invalid connection id"),
        check('rsvp-type')
            .isIn(['yes', 'no', 'maybe'])
            .withMessage("Invalid rsvp value")
    ],
    loginRequired,
    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.redirect('connections');
        }

        userProfile.addConnectionById(
        req.session.userProfile._id,
        req.body['connection-id'],
        req.body['rsvp-type'],
        (result) => {
            res.redirect('/user/connections'); // redirecting to my connections
        });
});

// Render my connections page
router.get('/connections', loginRequired, (req, res) => {

    console.log('userId: ', req.session.userProfile);

    userProfile.getUserConnections(req.session.userProfile._id, (result) => {

        userConnections = result;

        // Setting up page params
        let pageParams = { title: 'My Connections | KooD' };

        res.render('myConnections.ejs', {
            userConnections: userConnections,
            pageParams: pageParams,
            user: req.session.userProfile,
            errors: null
        });
    });
});

module.exports = router;