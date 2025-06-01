const express = require('express');
const path = require('path');

// Create an Express application
const app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up Expressjs
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts); // Use express-ejs-layouts

// Passport for session
const passport = require('passport');
const session = require('express-session');
app.use(session({
    secret: 'secret', // Change this to a secure secret in production!
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: false // Use `true` if you using HTTPS
    }
}));
app.use(passport.initialize());
app.use(passport.session());

// Initialize flash messages middleware
const flash = require('connect-flash');
app.use(flash());

// Set up routes
const indexRouter = require('./routes/index.cjs');
const usersRouter = require('./routes/users.cjs');
const journalsRouter = require('./routes/journals.cjs');
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/journals', journalsRouter);

// Catch 404 and forward to error handler
const createError = require('http-errors');
app.use(function(_, _, next) {
  next(createError(404));
});

// Error handler
app.use(function(err, req, res, _) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error', { title: 'Error', layout: 'no-layout' });
});

module.exports = app;
