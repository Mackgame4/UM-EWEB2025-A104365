const express = require('express');
const path = require('path');
const fs = require('fs');

// Create an Express application
const app = express();

// Connect to MongoDB
const mongoose = require('mongoose');
const mongoUri = 'mongodb://localhost:27017/trivialjournal';
mongoose.connect(mongoUri).catch(err => console.log(err));
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
    const foreGreen = '\x1b[32m';
    const foreReset = '\x1b[0m';
    console.log(foreGreen + 'Connected to MongoDB at ' + mongoUri + foreReset);
});

// Set up Expressjs
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const logStream = fs.createWriteStream(path.join(__dirname, 'logs.log'), { flags: 'a' });
app.use(logger('combined', { stream: logStream }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Set up routes
const indexRouter = require('./routes/index.cjs');
const filesRouter = require('./routes/files.cjs');
const journalsRouter = require('./routes/journals.cjs');
const usersRouter = require('./routes/users.cjs');
app.use('/', indexRouter);
app.use('/files', filesRouter);
app.use('/journals', journalsRouter);
app.use('/users', usersRouter);

function handleShutdown(signal) {
    console.log(`\nReceived ${signal}. Closing log stream and exiting.`);
    logStream.end(() => {
        console.log('Log stream closed.');
        process.exit(0);
    });
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('exit', () => handleShutdown('exit'));

module.exports = app;