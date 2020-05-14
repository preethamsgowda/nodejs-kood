const Connection = require('../models/connection');

let self = {};

// To fetch connections grouped by category
self.getConnectionsGroupedByCategory = (cb) => {

    // To group connections by categories
    // https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/
    // https://mongoosejs.com/docs/api.html#model_Model.aggregate
    Connection.aggregate(
        [
            {
                $match: {}
            },
            {
                $group: {
                    _id: "$connectionCategory",
                    "connections": {
                        $push: "$$ROOT"
                    },
                    "count": {
                        $sum: 1
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    "connectionCategory": "$_id",
                    "connections": 1,
                    "count" : 1
                }
            }
        ], (err, result) => {
            if (err) {
                console.error(err);
                cb(null);
            }
            else cb(result);
        }
    )
}

// To get a single connection with connection id
self.getConnectionById = (connectionId, cb) => {
    Connection.findOne({connectionId: connectionId}, (err, result) => {
        if (err) {
            console.error(err);
            cb(null);
        }
        else cb(result);
    })
}

// To create a new connection
self.saveConnection = (connection, cb) => {

    Connection.init();

    var connection = new Connection({
        connectionName: connection.name, 
        connectionCategory: connection.topic, 
        details: connection.details,
        date: connection.when, 
        thumbnail: 'default.png', 
        location: connection.where 
    });

    connection.save((err, result) => {
        if (err) {
            console.error(err);
            cb(null);
        }
        else cb(result);
    });
}

module.exports = self;