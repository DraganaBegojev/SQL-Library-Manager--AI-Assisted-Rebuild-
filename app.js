var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const methodOverride = require('method-override');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var booksRouter = require('./routes/books');

// import Sequelize instance to sync models
const { sequelize } = require('./models');

var app = express();

//  IIFE to sync and authenticate DB
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    await sequelize.sync(); // Sync all defined models to the DB
    console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('The page you requested could not be found.');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
// ensure the error has a status and a message
  err.status = err.status || 500;
  err.message = err.message || 'An unexpected error occurred. Please try again later.';

  // Log status and message
  console.log('Error', err.status + ':', err.message);

  // render the error page
  res.status(err.status);
  res.render('error', { err });
});

module.exports = app;
