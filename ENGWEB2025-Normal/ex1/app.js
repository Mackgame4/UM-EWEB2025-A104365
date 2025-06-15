var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var edicoesRouter = require('./routes/edicoes');
var paisesRouter = require('./routes/paises');
var interpretesRouter = require('./routes/interpretes');

// connection to mongoDB to books database 
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/eurovisao')
    .then(async () => {
        console.log('MongoDB connected successfully!');
    })
    .catch(err => console.error('MongoDB connection error:', err));

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/edicoes', edicoesRouter);
app.use('/paises', paisesRouter);
app.use('/interpretes', interpretesRouter);

module.exports = app;
