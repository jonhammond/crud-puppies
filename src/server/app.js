// *** main dependencies *** //
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var pg = require('pg');

// *** express instance *** //
var app = express();

// *** database *** //
var connectionString = 'postgres://localhost:5432/puppies';


// *** routes *** //
var routes = require('./routes/index.js');


// *** view engine *** //
var swig = new swig.Swig();
app.engine('html', swig.renderFile);
app.set('view engine', 'html');


// *** static directory *** //
app.set('views', path.join(__dirname, 'views'));


// *** config middleware *** //
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));


// *** main routes *** //
app.use('/', routes);

// return all the puppies //
app.get('/api/puppies', function(req, res, next) {

  var responseArray = [];

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      return res.status(500)
        .json({
          status: 'error',
          message: 'Something went wrong'
        });
    }
    //query the database
    var query = client.query('SELECT * FROM Pups');
    // get all rows
    query.on('row', function(row) {
      responseArray.push(row);
    });
    // send data back as json
    query.on('end', function() {
      res.json(responseArray);
      done();
    });
    // close the connection
    pg.end();
  });
});

// add a SINGLE puppy //

app.post('/api/puppies', function(req, res, next) {

  var newPuppy = req.body;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      return res.status(500)
        .json({
          status: 'error',
          message: 'Something went wrong'
        });
    }
    //insert into the database

    var query = client.query("INSERT INTO Pups (name, breed, age, sex, alive) VALUES ('" + newPuppy.name + "','" + newPuppy.breed + "','" + newPuppy.age + "','" + newPuppy.sex+ "','" + newPuppy.alive + "');");
    // get all rows
    query.on('row', function(row) {
      responseArray.push(row);
    });
    // send data back as json
    query.on('end', function() {
      res.json({status: 'success', message: 'Inserted new puppy into the pound!'});
      done();
    });
    // close the connection
    pg.end();
  });
});

// remove a SINGLE puppy
app.delete('/api/puppy/:id', function(req, res, next) {

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      return res.status(500)
        .json({
          status: 'error',
          message: 'Something went wrong'
        });
    }
    //query the database
    var query = client.query('DELETE FROM Pups WHERE id =' + req.params.id);

    // send data back as json
    query.on('end', function() {
      res.json({status:'success', message: 'One less puppy.'});
      done();
    });
    // close the connection
    pg.end();
  });
});

// update a SINGLE puppy
// sample curl => curl -X PUT -d column=name -d value=johnny localhost:5000/api/puppy/id
app.put('/api/puppy/:id', function(req, res, next) {

  var newPuppy = req.body;

  pg.connect(connectionString, function (err, client, done) {

    if(err) {
      done();
      return res.status(500)
        .json({
          status: 'error',
          message: 'Something went wrong'
        });
    }
    //insert into the database

    var query = client.query("UPDATE Pups SET "+req.body.column+"='"+req.body.value+"' WHERE id="+req.params.id);
    // get all rows
    query.on('row', function(row) {
      responseArray.push(row);
    });
    // send data back as json
    query.on('end', function() {
      res.json({status: 'success', message: 'Inserted new puppy into the pound!'});
      done();
    });
    // close the connection
    pg.end();
  });
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});


// *** error handlers *** //

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
