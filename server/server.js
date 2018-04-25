'use strict';

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {serverClient: true});
const nunjucks = require('nunjucks');
const mongoose = require('mongoose');
const passport = require('passport');
const {Strategy} = require('passport-jwt');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const {jwt} = require('./config');

let port = 8080;

passport.use(new Strategy(jwt, function(jwt_payload, done) {
    if (jwt_payload != void(0)) return done(false, jwt_payload);
    done();
}));


mongoose.connect('mongodb://localhost:27017/expresschat', {});
//mongoose.Promise = require('bluebird');
mongoose.set('debug', true);    

app.set('io', io );

nunjucks.configure('./client/views', {
    autoescape: true,
    express: app
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

require('./router')(app);

require('./sockets')(io);

server.listen(port, () => {
    console.log('Server started on port', port);
});
