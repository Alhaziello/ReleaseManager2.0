var serrc = require('../models/serrcModel.js');


// FUNCTION TO INSERT A NEW SERRC INTO THE DATABASE:

exports.addSerrc = function(req, res) {
    // console.log(req);
    var newserrc = new serrc();      // create a new instance of the Bear model

    newserrc.serrcNo = req.body.serrcNo.toUpperCase().trim();
    newserrc.programName = req.body.programName.toUpperCase().trim();
    newserrc.cause = req.body.cause;
    newserrc.action = req.body.action;

        serrc.find(
            {
               "serrcNo": newserrc.serrcNo
            }, function (err, RQitem) {
                if (err)
                    res.send(err);
                else if (RQitem[0] == null)

                    // Save the SERRC message in the DB and check for errors.
                        newserrc.save(function (err) {
                            if (err)
                                res.send(err);
                            else
                            // res.json({ message: 'Serrc Added to the DataBase!' });
                                res.send('Requested SERRC has been added successfully!');
                        });
                else
                    // console.log('Response:', RQitem);
                    res.send('SERRC - Already defined!');

            });
};


// FUNCTION TO RETRIEVE ALL AVAILABLE SERRC(S) FROM THE DATABASEL:

exports.getSerrcList = function(req, res) {

       serrc.find(function(err, serrcList) {
           if (err)
               res.send(err);
           else
               res.json(serrcList);
        });
};


// FUNCTION TO RETRIEVE SPECIFIC SERRC FROM THE DATABASE:

exports.findSerrc = function(req, res) {

        serrc.find(
            {
            "serrcNo": req.params.serrc_no.toUpperCase()
            }, function(err, serrcItem) {
                if (err)
                    res.send(err);
                else if (serrcItem[0] == null)
                    res.json(serrcItem);
                else
                    res.send(serrcItem[0].serrcNo);
        });
};



// FUNCTION TO RETRIEVE THE PROGRAM NAME ASSOCIATED TO A SPECIFIC SERRC:

exports.findSerrcPgm = function(req, res) {

    serrc.find(
        {
            "serrcNo": req.params.serrc_no.toUpperCase()
        }, function(err, serrcItem) {
            if (err)
                res.send(err);
            else if (serrcItem[0] == null)
                res.json(serrcItem);
            else
                res.send(serrcItem[0].programName);
        });
};


// FUNCTION TO REMOVE A SPECIFIC SERRC FROM THE DATABASE:

exports.deleteSerrc = function(req, res) {

    serrc.find(
        {
            "serrcNo": req.params.serrc_no.toUpperCase()
        }, function(err, serrcItem) {
            if (err)
                res.send(err);
            else if (serrcItem[0] != null)
                serrc.remove(
                        {
                            "serrcNo": req.params.serrc_no.toUpperCase()
                        }, function (err) {
                            if (err)
                                res.send(err);
                            else
                                res.send('SERRC removed successfully from the database');
                        });
            else
                res.send('SERRC - Not Found');
        });

};




// FUNCTION TO INSERT MULTIPLE SERRC(S) INTO THE DATABASE:
//          (MOSTLY USED DURING THE SET-UP)

exports.addMultipleSerrc = function(req, res) {

    var data = req.body;
    for(var i = 0; i < data.length; i++) {

        console.log(data[i].serrcNo , i , data.length , ';');
        // console.log(data);
        // res.send(data);
        var newserrc = new serrc();      // create a new instance of the Bear model

        newserrc.serrcNo = data[i].serrcNo.toUpperCase();
        newserrc.programName = data[i].programName;
        newserrc.cause = data[i].cause;
        newserrc.action = data[i].action;
        newserrc.save(function (err) {});

    }

    // Save the SERRC in the DB and check for errors:
    newserrc.save(function(err) {
        if (err)
            res.send(err);
        else
            res.json({ message: 'Serrc Added to the DataBase!' });
    });

};
