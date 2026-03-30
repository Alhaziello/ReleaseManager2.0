var promote = require('../models/promoteModel.js');
const fs = require('fs-extra')

// Function to add promote Rq message in the DB
exports.addPromote = function(req, res) {

    console.log('New promote item  added to DB!');

    var promotes = new promote();
    promotes.PromoteMacroList = req.body.PromoteMacroList;
    promotes.PromoteProgramList = req.body.PromoteProgramList;
    promotes.PromoteSheetData = req.body.PromoteSheetData;

    // Save the promote message in the DB and check for errors.
    promotes.save(function(err, promoteItem) {
        if (err)
            res.send(err);
        else
            res.send(promoteItem._id);
            // res.json({ message: 'New promote item created successfully!' });
    });
};

// Function to PUT/update the promote file fields:
exports.updatePromoteLoadDate = function(req, res) {
    console.log('Updating Load Date!!', req.body.loadDate);

    promote.findById(req.params.promote_id).exec(function (err, promoteFile) {
        if (err)
            res.send(err);

        promoteFile.PromoteSheetData.forEach(function(item){
            item.loadDate = req.body.loadDate;
            // console.log(req.body.loadDate.length);
        });

        promoteFile.save(function (err, output) {
            if (err)
                res.send(err);
            else
                res.send(output);
        });
    });
};

exports.updatePromoteNote = function(req, res) {
    console.log('Updating Note!!', req.body.note);

    promote.findById(req.params.promote_id).exec(function (err, promoteFile) {
        if (err)
            res.send(err);

        promoteFile.PromoteSheetData.forEach(function(item){
            item.note = req.body.note;
        });

        promoteFile.save(function (err, output) {
            if (err)
                res.send(err);
            else
                res.send(output);
        });
    });
};
exports.updatePromoteColsolDate = function(req, res) {
    console.log('Updating Consolidation Date!!', req.body.colsolDate);

    promote.findById(req.params.promote_id).exec(function (err, promoteFile) {
        if (err)
            res.send(err);

        promoteFile.PromoteSheetData.forEach(function(item){
            item.colsolDate = req.body.colsolDate;
            // console.log(req.body.colsolDate.length);
        });

        promoteFile.save(function (err, output) {
            if (err)
                res.send(err);
            else
                res.send(output);
        });
    });
};
exports.updatePromoteColsolModule = function(req, res) {
    console.log('Updating Consolidate Module!!', req.body.colsolMod);
    promote.findById(req.params.promote_id).exec(function (err, promoteFile) {
        if (err)
            res.send(err);

        promoteFile.PromoteSheetData.forEach(function(item){
            item.colsolMod = req.body.colsolMod;
            // console.log(req.body.colsolMod.length);
        });

        promoteFile.save(function (err, output) {
            if (err)
                res.send(err);
            else
                res.send(output);
        });
    });
};
exports.updatePromoteChangeNumber = function(req, res) {
    console.log('Updating Service-Now Reference!!', req.body.changeNumber);
    promote.findById(req.params.promote_id).exec(function (err, promoteFile) {
        if (err)
            res.send(err);

        promoteFile.PromoteSheetData.forEach(function(item){
            item.changeNumber = req.body.changeNumber;
            // console.log(req.body.changeNumber.length);
        });

        promoteFile.save(function (err, output) {
            if (err)
                res.send(err);
            else
                res.send(output);
        });
    });
};

// Function to PUT/update the system useage section of promote file:
// exports.updatePromote = function(req, res) {
//
//     promote.findById(req.body.id).exec(function (err, promoteFile) {
//         if (err)
//             res.send(err);
//
//             promoteFile.PromoteSheetData.forEach(function(item){
//
//                 // console.log(item._id);
//                 // item.loadDate = req.body.loadDate;
//                 if(req.body.loadDate.length > 0) {
//                     item.loadDate = req.body.loadDate;
//                     console.log(req.body.loadDate.length);
//                 }
//                 if(req.body.note.length > 0) {
//                     item.note = req.body.note;
//                     console.log(req.body.note.length);
//                 }
//                 if(req.body.colsolDate.length > 0) {
//                     item.colsolDate = req.body.colsolDate;
//                     console.log(req.body.colsolDate.length);
//                 }
//                 if(req.body.colsolMod.length > 0) {
//                     item.colsolMod = req.body.colsolMod;
//                     console.log(req.body.colsolMod.length);
//                 }
//                 if(req.body.changeNumber.length > 0) {
//                     item.changeNumber = req.body.changeNumber;
//                     console.log(req.body.changeNumber.length);
//                 }
//             });
//
//             promoteFile.save(function (err, output) {
//                 if (err)
//                     res.send(err);
//                 else
//                     res.send(output);
//             });
//     });
// };
//

// Function to Update Special Requirement Section:

exports.updateSpecialRequirement = function(req, res) {
    console.log('Updating Special Requirements!!', req.body.specialRequirement);
    promote.findById(req.params.promote_id).exec(function (err, promoteFile) {
        if (err)
            res.send(err);

        promoteFile.PromoteSheetData.forEach(function(item){
            item.specialRequirement = req.body.specialRequirement;
            // console.log(req.body.changeNumber.length);
        });

        promoteFile.save(function (err, output) {
            if (err)
                res.send(err);
            else
                res.send(output);
        });
    });
};

// Function to get list of all promote messages from the DB
exports.getPromoteList = function(req, res) {

    console.log('Retrieving the promote list from DB', req.connection.user);

    promote.find(function (err, promoteList) {
        if (err)
            res.send(err);
        else
            res.json(promoteList);
    });
};

// Function to get a specific Promote
exports.findPromote = function(req, res) {

        console.log('Retrieving requested promote item from DB ');

        promote.findById(req.params.promote_id, function(err, promoteItemFound) {
            if (err)
                res.send(err);
            else
                res.json(promoteItemFound);
        });
};

// Function to PUT/update the fallback details in the promote file
exports.updateFallbackData = function(req, res) {

    // console.log(req);
    console.log('Updating Fallback info on a requested promote file');

    promote.findById(req.params.promote_id).exec(function (err, fallbackFile) {
        if (err)
            res.send(err);

        fallbackFile.PromoteSheetData.forEach(function(item){

            // console.log(item.jobStatus );

            // if(item.jobStatus != "Fallback" ) {

                // console.log(req.body);
                if (req.body.jobStatus.length > 0) {
                    item.jobStatus = req.body.jobStatus;
                    console.log(req.body.jobStatus.length);
                }
                if (req.body.fallbackDate.length > 0) {
                    item.fallbackDate = req.body.fallbackDate;
                    console.log(req.body.fallbackDate.length);
                }
                if (req.body.fbkGitSha.length > 0) {
                    item.fbkGitSha = req.body.fbkGitSha;
                    console.log(req.body.fbkGitSha.length);
                }
                if (req.body.fbkJobId.length > 0) {
                    item.fbkJobId = req.body.fbkJobId;
                    console.log(req.body.fbkJobId.length);
                }
                if (req.body.fbkNote.length > 0) {
                    item.fbkNote = req.body.fbkNote;
                    console.log(req.body.fbkNote.length);
                }
            // }
        });

        fallbackFile.save(function (err, output) {
            if (err)
                res.send(err);
            else
                res.send(output);
        });
    });
};

// Function to PUT/update the JobStatus in the promote file
//
// -------------------------------------------------------------
//  Example RQ:
//              {
//                  "jobStatus": "UAT in Progress on QUAL",
//                   "oldLocation": "D:\\SerrcList.json",
//                   "newLocation": "D:\\JAR\\SerrcList.json"
//              }
//
// -------------------------------------------------------------
exports.updatePromoteJobStatus = function(req, res) {

    console.log('Updating Job Status!!', req.body.jobStatus);

    promote.findById(req.params.promote_id).exec(function (err, promoteFile) {
        if (err)
            res.send(err);

        promoteFile.PromoteSheetData.forEach(function(item){

            item.jobStatus = req.body.jobStatus;

            fs.move(req.body.oldLocation, req.body.newLocation, {overwrite: true}, err => {
                if (err) return console.error(err)
                // .then(() => {
                console.log('Moved the Load Module to Prod Directory!', 'From ', req.body.oldLocation, 'To ', req.body.newLocation)
            })
            // .catch(err => {
            //         console.error(err)
            // })
        });

        promoteFile.save(function (err, output) {
            if (err)
                res.send(err);
            else
                 res.send(output);
        });
    });
};

// Function to PUT/update the JobStatus in the promote file

// exports.set = function(req, res) {
//
//     // console.log(req);
//
//     promote.findById(req.params.promote_id).exec(function (err, promoteFile) {
//         if (err)
//             res.send(err);
//
//         // console.log(promoteFile);
//
//         promoteFile.PromoteSheetData.forEach(function(item){
//
//             item.jobStatus = req.body.jobStatus;
//             console.log(req.body.jobStatus.length);
//
//             fs.move(req.body.oldLocation, req.body.newLocation, {}, err =>{
//                 if (err) return console.error(err)
//                 // .then(() => {
//                 console.log('Moved the Load Module to Prod Directory!')
//         })
//         .catch(err => {
//                 console.error(err)
//         })
//         });
//
//         promoteFile.save(function (err, output) {
//             if (err)
//                 res.send(err);
//             else
//                 res.send(output);
//         });
//     });
// };

// Function to remove the requested promote file:
exports.deletePromote = function(req, res) {

    console.log('Requested file has been removed from the Database');


    promote.findById(req.params.promote_id).exec(function (err, requestedFile) {
        if (err)
            res.send(err);
        // console.log(requestedFile);

            requestedFile.remove(function (err, output) {
                if (err)
                    res.send(err);
                else
                    res.send(output);
        });
    });
};