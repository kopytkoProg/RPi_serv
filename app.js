var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var expressSession = require('express-session');
var router = express.Router();
var flash = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;
var Users = require('./Users');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());


//=======================================================
//      Configuring Passport
//=======================================================
app.use(expressSession({secret: 'mySecretKey'}));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());


passport.serializeUser(function (user, done)
{
    done(null, user);
});

passport.deserializeUser(function (user, done)
{
    done(null, user);
});


passport.use('login', new LocalStrategy({
        passReqToCallback: true
    },
    function (req, username, password, done)
    {
        //return done(null, {username: username, id : 1});
        Users.findOneUser(username, password, function (user)
        {
            if (user == null)
                return done(null, false, {message: 'Incorrect username or password'});
            return done(null, user);
        });

    }));


//=======================================================


//=======================================================
//      Pages
//=======================================================
var isAuthenticated = require('./isAuthenticated');


app.use(express.static(path.join(__dirname, 'public')));
app.use('/login', require('./routes/login'));


app.use('/api/devices', /*isAuthenticated.sendUnauthorizedIfUnauthenticated,*/ require('./routes/api/devices/devices'));
app.use('/api/temp_1wire', isAuthenticated.sendUnauthorizedIfUnauthenticated, require('./routes/api/temp_1wire/temp_1wire'));
app.use('/api/test', isAuthenticated.sendUnauthorizedIfUnauthenticated, require('./routes/api/test'));
app.use('/api/ps', isAuthenticated.sendUnauthorizedIfUnauthenticated, require('./routes/api/ps/ps'));
app.use('/api/os', isAuthenticated.sendUnauthorizedIfUnauthenticated, require('./routes/api/os/os'));


app.use('/t/', isAuthenticated.redirectIfNotAuthenticated, express.static(path.join(__dirname, 'private')));
app.use('/', isAuthenticated.redirectIfNotAuthenticated, require('./routes/index'));


//=======================================================

// catch 404 and forward to error handler
app.use(function (req, res, next)
{
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development')
{
    app.use(function (err, req, res, next)
    {
        res.status(err.status || 500);
        throw (err);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next)
{

    res.status(err.status || 500);
    console.error(err.message, err.stack);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
