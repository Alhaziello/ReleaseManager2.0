var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
require("console-stamp")(console, { pattern : "dd/mm/yyyy HH:MM:ss.l" } );

// var session = require('express-session');
// var ntlm = require('express-ntlm');
// var mongoose = require('mongoose');
// var MongoStore = require('connect-mongo')(session);


module.exports =function (app, config) {

    // view engine setup

        app.set('views', path.join(config.rootPath, 'server/views'));
        app.set('view engine', 'ejs');
        // app.engine('html', require('ejs').renderFile);

        // app.use(ntlm());



        // app.use(session({
        //     store: new MongoStore({ mongooseConnection: mongoose.connection,
        //                             ttl: (1 * 60 * 60)}),
        //     secret: 'keyboard cat',
        //     saveUninitialized: true,
        //     resave: false,
        //     cookie: {
        //         path: '/',
        //         httpOnly: true,
        //         secure: true,
        //         maxAge: 24 * 60 * 60 * 1000,
        //     },
        //     name: "id",
        // }));


        // app.get('/',function(req,res){
        //     req.session(req.ntlm);
        //     // create new session object.
        //     if(req.session.key) {
        //         // if email key is sent redirect.
        //         res.redirect('/admin');
        //     } else {
        //         // else go to home page.
        //         res.render('index.html');
        //     }
        // });

        // app.post('/login',function(req,res){
        //     // when user login set the key to redis.
        //     req.session.key=req.body.email;
        //     res.end('done');
        // });
        //
        // app.get('/logout',function(req,res){
        //     req.session.destroy(function(err){
        //         if(err){
        //             console.log(err);
        //         } else {
        //             res.redirect('/');
        //         }
        //     });
        // });

        // app.get('*', function (req, res, next) {
        //     // console.log(req);
        //     // res.send(req);
        //     // var see = req;
        //     // res.send(JSON.stringify(see));
        //
        // })

        app.use(logger('dev'));
        app.use(bodyParser.json({limit: '200mb'}));
        app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));
        app.use(cookieParser());
        // app.use(express.static(path.join(config.rootPath, 'public/app')));
        app.use(express.static(path.join(config.rootPath, 'server/views')));
};

