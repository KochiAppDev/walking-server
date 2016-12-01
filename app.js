var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
//var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var env = require('node-env-file');
if (process.env.DATABASE_URL === void 0) {
    env(__dirname + '/.env');
}

var index = require('./routes/index');
var users = require('./routes/users');

var device = require('./routes/device');
var token = require('./routes/token');
var init = require('./routes/init');
var config = require('./routes/config');
var setting = require('./routes/setting');
var info = require('./routes/info');
var location = require('./routes/location');
var position = require('./routes/position');
var route = require('./routes/route');
var add = require('./routes/add');
var remove = require('./routes/remove');
var group = require('./routes/group');
var plain = require('./routes/plain');
var stamp = require('./routes/stamp');
var picture = require('./routes/picture');
var message = require('./routes/message');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.use('/device', device);
app.use('/token', token);
app.use('/init', init);
app.use('/config', config);
app.use('/setting', setting);
app.use('/info', info);
app.use('/location', location);
app.use('/position', position);
app.use('/route', route);
app.use('/add', add);
app.use('/remove', remove);
app.use('/group', group);
app.use('/plain', plain);
app.use('/stamp', stamp);
app.use('/picture', picture);
app.use('/message', message);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
