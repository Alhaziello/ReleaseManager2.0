// app/models/promote.js

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;


var serrcSchema = new Schema({
    serrcNo: { type: String, unique: true, sparse: true, required: true },
    programName: { type: String, required: true },
    cause: String,
    action: String
}, {versionKey: false});

// var noIdSchema = new Schema({ name: String}, {_id: false});

module.exports = mongoose.model('serrc', serrcSchema);

