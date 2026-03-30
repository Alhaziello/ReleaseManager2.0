var express = require('express')
var router = express.Router();              // get an instance of the express Router
var pro = require('../controllers/promoteDBCtrl');
var serrc = require('../controllers/serrcDBCtrl');
var mongoose = require('mongoose');
// var fs = require('fs');
// var nodeSSPI = require('node-sspi');
// var nodeSSPIObj = new nodeSSPI({
//     retrieveGroups: true
// });

module.exports = function (app, config) {

    // app.use(ntlm({
    //     debug: function() {
    //         var args = Array.prototype.slice.apply(arguments);
    //         console.log.apply(null, args);
    //     },
    //     // domain: 'AirNZ-NZ',
    //     domaincontroller: 'ldap://akl1wc931.corp.ad.airnz.co.nz',
    //     tlsOptions: {
    //         //trusted certificate authorities (can be extracted from the server with openssh)
    //         // ca: fs.readFileSync('C:\\Users\\kumap3\\Airnz-gitblit-CA.pem'),
    //         //tells the tls module not to check the server's certificate (do not use in production)
    //         // rejectUnauthorized: false,
    //     }
    //     // use different port (default: 389)
    //     // domaincontroller: 'ldap://myad.example:3899',
    //
    //
    //
    // }));

    // app.all('*', function(request, response, next) {
    //     console.log(request.headers);
    //     // response.end(JSON.stringify(request.ntlm));
    //     next();
    // });
    //
    // app.use(function (req, res, next) {
        // console.log('Praveen:', req.headers);
    //     nodeSSPIObj.authenticate(req, res, function(err){
    //             if (req.connection.user) {
    //                 ntUser = req.connection.user;
    //                 // res.status(200).send(ntUser);
    //                 res.finished || next();
    //             } else {
    //                 console.log("req user empty");
    //
    //             }
    //         // res.finished || next();
    //     });
    // });

// Router : Header Definitions
    router.use(function(req, res, next) {
        // do logging
        console.log('RESTful Web services is running good... ');
        console.log('     ');
        res.header("Access-Control-Allow-Origin", "http://carinarm");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, X-Auth-Token");
        res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");

        // app.use(function (req, res, next) {
        //     var nodeSSPI = require('node-sspi');
        //     var nodeSSPIObj = new nodeSSPI({
        //         retrieveGroups: true
        //     });
        //     nodeSSPIObj.authenticate(req, res, function(err){
        //         res.finished || next();
        //     });
        // });

        // var userName = req.connection.user;
        // var regex = /^AIRNZ-NZ\\(\w{6})$/
        // var result = userName.match(regex);
        // var currentUser = result[1];

        // console.log('=====================================');
        // console.log(' API Current User: ', req.ntlm.UserName);
        // console.log('=====================================');


        // mongoose.connect(config.db);
        // var db = mongoose.connection;
        //     db.collection("promotes").find(query).toArray(function(err, result) {
        //         if (err) throw err;
        //         console.log(result);
        //         db.close();
        //     });

        next(); // make sure we go to the next routes and don't stop here
    });
    //
    // router.use(function (req, res, next) {
    //     var out = 'Hello ' + req.connection.user + '! You belong to following groups:<br/><ul>';
    //     if (req.connection.userGroups) {
    //         for (var i in req.connection.userGroups) {
    //             out += '<li>'+ req.connection.userGroups[i] + '</li><br/>\n';
    //         }
    //     }
    //     out += '</ul>';
    //     // res.console(out);
    //     // console.log(out);
    //     next(); // make sure we go to the next routes and don't stop here
    //
    // });

// Catch all route to log on the console for every execution
    router.get('/', function(req, res) {
        res.json({ message: 'hooray! welcome to our api!'});
    });

// API routes for PROMOTE post and get
    router.route('/promote')
        .post(pro.addPromote)
        .get(pro.getPromoteList);



// API routes for SERRC post and get
    router.route('/serrc')

        .post(serrc.addSerrc)
        .get(serrc.getSerrcList);

// API routes for SERRC find and delete on a specific item
    router.route('/serrc/:serrc_no')

        .get(serrc.findSerrc)
        .delete(serrc.deleteSerrc);

// API routes for get the program name associated to the requested serrc item
    router.route('/serrc/pgm/:serrc_no')

        .get(serrc.findSerrcPgm);

// API routes to retrieve specific PROMOTE item
    router.route('/promote/:promote_id')

        .get(pro.findPromote)
        .put(pro.updateFallbackData)
        .delete(pro.deletePromote);

// API routes for updating promote fields

    // Router to update Load Date in Promote File
    router.route('/promote/:promote_id/updldate')
        .put(pro.updatePromoteLoadDate);

    // Router to update Promote Note in Promote File
    router.route('/promote/:promote_id/updnote')
        .put(pro.updatePromoteNote);

    // Router to update Consolidated Date in Promote File
    router.route('/promote/:promote_id/updcdate')
        .put(pro.updatePromoteColsolDate);

    // Router to update Consolidated Module in Promote File
    router.route('/promote/:promote_id/updcmod')
        .put(pro.updatePromoteColsolModule);

    // Router to update Service Now Change Number in Promote File
    router.route('/promote/:promote_id/updcnum')
        .put(pro.updatePromoteChangeNumber);

// API routes to update the requested PROMOTE item's Job Status
    router.route('/promote/:promote_id/updjobstatus')
        .put(pro.updatePromoteJobStatus);

// API routes to update the requested PROMOTE item's Job Special Requirement
    router.route('/promote/:promote_id/updsplrequirement')
        .put(pro.updateSpecialRequirement);

// API routes to all multiple (chunk of) serrc item into the database. (accepts 1.5k tp 3.5k serrcs in a single run)
    router.route('/chunk/serrc')
        .post(serrc.addMultipleSerrc);

//  ====================   End of API route section  ====================


    // app.use(function (req, res, next) {
    //     var nodeSSPI = require('node-sspi');
    //     var nodeSSPIObj = new nodeSSPI({
    //         retrieveGroups: true
    //     });
    //     nodeSSPIObj.authenticate(req, res, function(err){
    //         res.finished || next();
    //     });
    // });

    // app.use(function (req, res, next) {
    //     var out = 'Hello ' + req.connection.user + '! You belong to following groups:<br/><ul>';
    //     if (req.connection.userGroups) {
    //         for (var i in req.connection.userGroups) {
    //             out += '<li>'+ req.connection.userGroups[i] + '</li><br/>\n';
    //         }
    //     }
    //     out += '</ul>';
    //     res.send(out);
    // });

// partial to all ejs display request (public/app/...<all sub directories>......)

    app.get('/listing', function (req, res) {
        // console.log(req.params[0]);
        res.render(req.params[0]);
    });

// default router - catch all route for all unknown requests : routs to home page

    app.get('/', function(req, res){

        // var userName = req.connection.user;
        // var regex = /^AIRNZ-NZ\\(\w{6})$/
        // var result = userName.match(regex);
        // var currentUser = result[1];

        // console.log('=============================');
        // console.log('Logged-In User: ', req.ntlm.UserName);
        // console.log('=============================');

        // var query = {user: req.connection.user};
        // var dbConnect = mongoose.connection.collection('permission').find(query);
        //     dbConnect.toArray(function (err, item){
        //         if (item[0] == null)
        //            var appRole = 'none';
        //         else if (item[0] !== null)
        //            var appRole = item[0].role;
        // res.render('index', {
        //     user: req.ntlm,
        //     role: appRole
        // });      // Important to place this at last
        //
        // });
        res.render('index', {
                    // role: 'appRole'
        });      // Important to place this at last
    });



    //
    // app.post('/', function(req, res){
    //     res.render('index', {list: data});
    // });

    app.use('/api', router);

// catch 404 and forward to error handler
    app.use(function(req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handler
    app.use(function(err, req, res, next) {
        // set locals, only providing error in development
        console.log(err);
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    });

};