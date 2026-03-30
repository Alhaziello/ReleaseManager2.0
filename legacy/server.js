var express = require('express');
var session = require('express-session');
var app = express();
var mongoose = require('mongoose');

// var encode = require('nodejs-base64-encode');
// var nodeSSPI = require('node-sspi');
// var nodeSSPIObj = new nodeSSPI({
//     retrieveGroups: true
// });


// if(process.env.deploy_env === 'live') {
//     var env = process.env.NODE_ENV = process.env.NODE_ENV || 'live';
// }
// else if(process.env.deploy_env === 'test') {
//     var env = process.env.NODE_ENV = process.env.NODE_ENV || 'test';
// }
// else if(process.env.deploy_env === 'dev') {
//     var env = process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
// }

var env = process.env.NODE_ENV;

console.log('Current Node Server Environment:', env);

// var router = express.Router();
// var routes = require('./server/routes');
// var index = require('./routes/index')(nav);
// var users = require('./routes/users')(nav);


var config = require('./server/config/config')[env];

require('./server/config/express')(app, config);
require('./server/config/mongoose')(config);
require('./server/config/routes')(app, config);




// app.use('/', index);
// app.use('/users', users);

module.exports = app;
