const express = require('express');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const bodyParser = require('body-parser');
const index = require('./routes/index');

const app = express();

app.set('view engine', 'ejs');

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  debug: true,
  outputStyle: 'compressed'
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', index);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');

  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('service_error', {
    title: 'Codewars-error',
    message: err.message,
    status: err.status
  });
});

module.exports = app;
