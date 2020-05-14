const mongoose = require('mongoose');
const dbConnection = require('./connectionDB');
const UserConnection = require('../models/userConnection');

let self = {};

// To add a connection to user connections
self.addConnectionById = (userId, connectionId, rsvp, cb) => {
    UserConnection.findOneAndUpdate({
        user: userId,
        connection: connectionId
    },
    {
        user: userId,
        connection: connectionId,
        rsvp: rsvp
    },
    {
        upsert: true
    },
    (err, result) => {
        if (err) {
            console.error(err);
            cb(null);
        }
        else cb(result);
    });
};

// To remove a connecton from user connections with connection id
self.removeConnectionById = (userId, connectionId, cb) => {
    UserConnection.deleteOne({
        user: userId,
        connection: connectionId
    },
    (err, result) => {
        if (err) {
            console.error(err);
            cb(null);
        }
        else cb(result);
    });
};

// To get user connections
self.getUserConnections = (userId, cb) => {

        UserConnection
            .aggregate([
                {
                    $match: {
                        user: mongoose.Types.ObjectId(userId)
                    }
                },
                {
                    $lookup: {
                        "from": "connections",
                        "localField":"connection",
                        "foreignField":"connectionId",
                        "as":"connection"
                    }
                }
            ],
            (err, result) => {
                if (err) {
                    console.error(err);
                    cb(null);
                }
                else cb(result);
            });
};

module.exports = self;