var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var logger = require('morgan');
const cors = require('cors');
const dotenv = require('dotenv');

var indexRouter = require('./routes/auth.router');
var adminRouter = require('./routes/admin.router');
var userRouter = require('./routes/user.router');

var app = express();

dotenv.config();

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/auth', indexRouter);
app.use('/admin', adminRouter);
app.use('/', userRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404).json({ 
    message: 'Not Found',
    status: 404
  });
});

// error handler
app.use(function(err, req, res, next) {
  // Log the error for server-side tracking
  console.error(err);

  // Send JSON response for errors
  res.status(err.status || 500).json({
    message: err.message,
    status: err.status || 500,
    // Only include error details in development
    ...(process.env.NODE_ENV === 'development' && { error: err })
  });
});


module.exports = app;
