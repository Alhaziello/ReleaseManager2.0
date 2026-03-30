// app/models/promote.js

var mongoose        = require('mongoose');
var Schema          = mongoose.Schema;

// Pre-defined sub-documents schema:

var subMacPromote = {

    macroName: String,
    promoteResponse: String,
    promoteTime: String

};

var subPgmPromote = {

    program: String,
    oldVersion: Number,
    newVersion: Number,
    promoteResponse: String,
    assemblyCc: String,
    promoteTime: String,
    programListing: String

};

var subPromoteData = {

    ticketNo: String,
    programmer: String,
    project: String,
    description: String,
    jenkinsJobId: Number,
    gitSha: String,
    testerName1: String,
    testerName2: String,
    specialRequirement: String,
    fallbackOption: String,
    loadModule: String,
    colsolMod: String,
    promoteDate: String,
    loadDate: String,
    changeNumber: String,
    colsolDate: String,
    note: String,
    jobStatus: String,
    fallbackDate: String,
    fbkGitSha: String,
    fbkJobId: Number,
    fbkNote: String

};

// Define main document schema:

var promoteSchema = new Schema({
    PromoteMacroList: [ subMacPromote ],
    PromoteProgramList: [ subPgmPromote ],
    PromoteSheetData: [ subPromoteData ]
}, {versionKey: false}, { _id : false });

module.exports = mongoose.model('Promote', promoteSchema);




