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
//var users = require('./routes/users');

var routes_device = require('./routes/device');
var routes_token = require('./routes/token');
var routes_init = require('./routes/init');
var routes_config = require('./routes/config');
var routes_setting = require('./routes/setting');
var routes_info = require('./routes/info');
var routes_location = require('./routes/location');
var routes_position = require('./routes/position');
var routes_route = require('./routes/route');
var routes_add = require('./routes/add');
var routes_remove = require('./routes/remove');
var routes_group = require('./routes/group');
var routes_plain = require('./routes/plain');
var routes_stamp = require('./routes/stamp');
var routes_picture = require('./routes/picture');
var routes_message = require('./routes/message');
var routes_talk = require('./routes/talk');

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
//app.use('/users', users);
app.use('/device', routes_device);
app.use('/token', routes_token);
app.use('/init', routes_init);
app.use('/config', routes_config);
app.use('/setting', routes_setting);
app.use('/info', routes_info);
app.use('/location', routes_location);
app.use('/position', routes_position);
app.use('/route', routes_route);
app.use('/add', routes_add);
app.use('/remove', routes_remove);
app.use('/group', routes_group);
app.use('/plain', routes_plain);
app.use('/stamp', routes_stamp);
app.use('/picture', routes_picture);
app.use('/message', routes_message);
app.use('/talk', routes_talk);

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
