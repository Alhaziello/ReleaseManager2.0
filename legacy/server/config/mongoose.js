var mongoose = require('mongoose');


module.exports = function (config) {
    mongoose.connect(config.db);
    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connect2on error ... '));
    db.once('open', function callback() {
        console.log('Connected to CARINA database of MongoDB');

        // Test code to display DB contents:
        //     var result = db.collection('promotes').find();
        //     result.each(function (err, item) {
        //             console.log(item);
        // });
    });
};