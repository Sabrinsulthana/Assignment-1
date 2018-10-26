var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport= require('passport');
var authenticate= require('./authenticate');
var config=require('./config');


var indexRouter = require('./Routers/index');
var usersRouter = require('./Routers/users');
var dishRouter = require('./Routers/dishRouter');
//var promoRouter = require('./routes/promosRouter');
//var leaderRouter = require('./routes/leadersRouter');

const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const Dishes = require('./models/dishes');
//const Promos = require('./models/promos')
//const Leaders = require('./models/leaders')

const url = config.mongoUrl;
const connect = mongoose.connect(url, {
  useMongoClient: true
});

connect.then((db) =>{
  console.log('Connected correctly to server');
}, (err) => { console.log(err); });

var app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321 ')); 

//app.use(session({
  //name: 'session-id',
  //secret: '12345-67890-09876-54321',
 // saveUninitialized: false,
 // resave: false,
  //store: new FileStore()
//}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth (req, res, next) {
  if(!req.user){
      var err = new Error('You are not authenticated!');
      err.status = 401;
     return next(err);
      
  }
else{
  if(req.session.user=='authenticated'){
    next();
  }else{
    var err = new Error('You are not authenticated!');
    err.status=401;
    return next(err);
  }
}
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/dishes', dishRouter);
// app.use('/promos', promoRouter);
// app.use('/leaders', leaderRouter);


app.use(function(req, res, next) {
  next(createError(404));
});


app.use(function(err, req, res, next) {
  
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
