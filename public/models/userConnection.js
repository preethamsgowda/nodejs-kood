let mongoose = require('mongoose');

var userConnectionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    connection: {
        type: Number,
        ref: "connection"
    },
    rsvp: {
        type: String,
        required: true
    }
}, { collection: 'userConnections' });

var UserConnection = mongoose.model('userConnection', userConnectionSchema);

module.exports = UserConnection;