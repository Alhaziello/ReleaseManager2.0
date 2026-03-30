
var path = require('path');
var rootPath = path.normalize(path.join(__dirname, '../../'));
var favicon = require('serve-favicon');

module.exports = {
    dev: {
        rootPath: rootPath,
        port: process.env.PORT || 3030,
        db: 'mongodb://127.0.0.1/carina'
    },
    test: {
        rootPath: rootPath,
        port: process.env.PORT || 3030,
        db: 'mongodb://127.0.0.1/carina'
    },
    live: {
        rootPath: rootPath,
        port: process.env.PORT || 3030,
        db: 'mongodb://127.0.0.1/carina'
    }
};