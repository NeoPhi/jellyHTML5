var debug = require('debug')('server');
var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var sessions = require('./lib/sessions');
var levels = require('./lib/levels');
var config = require('./lib/config');

mongoose.connect(config.mongo.url);

var app = express();

app.use(express.favicon('static/favicon.ico'));
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());

sessions.addMiddleware(app);

// Optional since express defaults to CWD/views
app.set('views', path.join('src', 'views'));
// Set our default template engine to "jade"
// which prevents the need for extensions
// (although you can still mix and match)
app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});

app.configure('development', function(){
  app.use(express.static('build'));
});
app.use(express.static('static'));

sessions.addRoutes(app);
levels.addRoutes(app);

var jsExt = config.extension.js;
var cssExt = config.extension.css;
var dailyCredId = config.dailyCred.id;

app.get('/', function(req, res){
  res.render('home', {
    user: req.user,
    jsExt: jsExt,
    cssExt: cssExt,
    dailyCredId: dailyCredId
  });
});

var port = config.server.port;
app.listen(port, function(err) {
  if (err) {
    throw err;
  }
  debug('Listening on port %d', port);
});
