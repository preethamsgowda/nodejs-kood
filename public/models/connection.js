const mongoose = require('mongoose');
const AutoIncrement = require('mongoose-sequence')(mongoose);

var connectionSchema = new mongoose.Schema({
    connectionId: {
        type: Number
    }, 
    connectionName: {
        type: String,
        required: true
    },
    connectionCategory: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    }
}, { collection: 'connections' });

connectionSchema.plugin(AutoIncrement, {inc_field: 'connectionId'});

var connection = mongoose.model('connection', connectionSchema);

module.exports = connection;