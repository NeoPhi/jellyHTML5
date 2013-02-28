var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
var sessions = require('./lib/sessions');

mongoose.connect('mongodb://localhost/jelly');

var app = express();

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());

sessions.addUsage(app);

// Optional since express defaults to CWD/views
app.set('views', path.join('src', 'views'));
// Set our default template engine to "jade"
// which prevents the need for extensions
// (although you can still mix and match)
app.set('view engine', 'jade');
app.set('view options', {
  layout: false
});

app.use(express['static']('build'));
app.use(express['static']('static'));

sessions.addRoutes(app);

var jsExt = process.env.JS_EXT;
var cssExt = process.env.CSS_EXT;

app.get('/', function(req, res){
  res.render('home', {
    user: req.user,
    jsExt: jsExt,
    cssExt: cssExt
  });
});

var port = process.env.PORT || 3000;
app.listen(port);
