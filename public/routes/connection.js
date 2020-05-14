const express = require('express');
const { check, validationResult } = require('express-validator');

const dbConnection = require('./../Utilities/connectionDB');
const userProfile = require('../Utilities/userProfileDB');

let thisModule = {
    connection: express.Router(), // To serve "/connection" route
    connections: express.Router() // To serve "/connections" routes
};

// Middleware to check if user has logged in for certain routes
const loginRequired = (req, res, next) => {
    if (req.session.userProfile) next();
    else res.redirect('/user/login'); // reroute to login page if the user has not logged in
}

// Renders all connections page
thisModule.connections.get('/', (req, res) => {

    // Fetch all connections
    dbConnection.getConnectionsGroupedByCategory((result) => {
        // Parameters to display page title
        let pageParams = { title: 'Connections | KooD' };

        res.render('connections.ejs', {
            result: result,
            pageParams: pageParams,
            connectionsSize: result.length,
            user: req.session.userProfile,
            errors: null
        });
    });
});

// Renders new connection page
thisModule.connections.get('/new', loginRequired, (req, res) => {

    let pageParams = { title: 'New Connection | KooD' };

    res.render('newConnection.ejs', {
        pageParams: pageParams,
        user: req.session.userProfile,
        errors: null
    });
});

// POST route to creat new connection
thisModule.connections.post(
    '/new',
    [
        check('topic')
            .isLength({ min: 4 })
            .trim()
            .escape()
            .withMessage("Topic should be of atleast 4 characters."),
        check('name')
            .isLength({ min: 4 })
            .trim()
            .escape()
            .withMessage("Connection name should be atleast of 4 chars."),
        check('details')
            .isLength({ min: 10 })
            .trim()
            .escape()
            .withMessage("Description should be of atleast 10 characters."),
        check('where')
            .isLength({ min: 3 })
            .trim()
            .escape()
            .withMessage("Location should be of atleast 3 chars."),
        check('when')
            .toDate(),
        check('at')
            .matches('^([0-2][0-9]):[0-5][0-9]')
            .withMessage("Please select valid time ")
    ],
    loginRequired,
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Parameters to display page title
            let pageParams = { title: 'New Connection | KooD' };
            return res.render('newConnection.ejs', {
                pageParams: pageParams,
                user: req.session.userProfile,
                errors: errors.array()
            });
        }

        console.log('req.body: ', req.body);

        dbConnection.saveConnection(req.body, (result) => {
            if (result == null) {
                console.log("Unable to save connection : ", req.body);
            }

            console.log("result: ", result);

            userProfile.addConnectionById(
                req.session.userProfile._id,
                result.connectionId,
                'yes',
                (result_2) => {
                    res.redirect('/user/connections'); // redirecting to my connections
                });
        });
    });

// Renders a single connection details page
thisModule.connection.get(
    '/:connectionId',
    [
        check('connectionId')
            .isNumeric()
            .isLength({ min: 1 })
            .withMessage("Invalid connection id")
    ],
    (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.redirect('/connections')
        }
        var connectionId = null;
        var connectionExists = false;

        // Check if the connection id is of valid format
        if (req.params && req.params.connectionId) {

            connectionId = req.params.connectionId;

            // Fetch connection details of a particular connection
            dbConnection.getConnectionById(connectionId, (result) => {
                if (result) {

                    // Flag variable to render update/add connection buttons in the view
                    connectionExists
                        = req.userProfile
                            ? req.userProfile.userHasConnectionWithId(connectionId)
                            : false;

                    let pageParams = { title: result.connectionName + ' | KooD' };
                    res.render('connection.ejs', {
                        connection: result,
                        pageParams: pageParams,
                        user: req.session.userProfile,
                        connectionExists: connectionExists,
                        errors: null
                    });

                } else { // If no connection with supplied connectionId

                    res.redirect('/connections/') // Redirect to all connections
                }
            });

        } else { // If no connection id is supplied

            res.redirect('/connections/') // Redirect to all connections
        }

    });

module.exports = thisModule;