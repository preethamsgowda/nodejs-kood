// Including 3rd party packages
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');
const favicon = require('serve-favicon');
const methodOverride = require('method-override');
const mongoose = require('mongoose');

// Including route files
const index = require('./routes/index');
const connection = require('./routes/connection').connection;
const connections = require('./routes/connection').connections;
const page_404 = require('./routes/page_404');
const about = require('./routes/about');
const contact = require('./routes/contact');
const user = require('./routes/user');

// Connecting to mongodb database "kood_db"
mongoose.connect(
	'mongodb://localhost/kood_db',
	{
		useNewUrlParser: true,
		useUnifiedTopology: true
    },
    err => {
        if(err) {
            return console.error('Failed to connect to the mongodb');
        }
    }
);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

// Port number to run on
const port = 8084;

// Initializing express
const app = express();

// Setting up view engine
app.set('view engine', 'ejs');

// Adding session middleware
app.use(session({secret: 'pr337h4m',
    resave: true,
    saveUninitialized: true
}));

// Adding body-parser middlware
app.use(bodyParser.urlencoded({ extended: true }));

// Adding favicon middleware to serve favicon
app.use(favicon(path.join(__dirname,'assets','images','favicon_io','favicon.ico')));

// Adding middlware to serve static files from assets folder
app.use('/assets', express.static('assets'));

// Adding method-override middleware to serve PUT and DELETE requests
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      var method = req.body._method;
      delete req.body._method;
      return method;
    }
}));

// Adding middleware to display the routes being displayed
app.use((req, res, next) => {
    console.log('Request Method: ', req.method, 'Route requested: ', req.url);
    next();
});

// Handling routes with respective route/controller files
app.use('/', index);
app.use('/connection/', connection);
app.use('/connections/', connections);
app.use('/about', about);
app.use('/contact', contact);
app.use('/user', user);
app.use('*', page_404); // handles rest of the unhandled routes and displays 404 error.

// Starting app on the given port number
app.listen(port);
console.log("Listening on port: ", port);