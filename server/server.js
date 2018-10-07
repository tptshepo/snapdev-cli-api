require('./config/config');
require('./db/mongoose');

const path = require('path');
var favicon = require('serve-favicon');
const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');

const app = express();
const port = process.env.PORT;
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon(path.join(__dirname, '/../public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/../')));

// Routes
const indexRoutes = require('./routes/index.route');
const packageRoutes = require('./routes/package.route');

app.use('/', indexRoutes);
app.use('/api/packages', packageRoutes);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((e, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = e.message;
  res.locals.error = req.app.get('env') === 'development' ? e : {};

  // render the error page
  res.status(e.status || 500);
  res.render('home/error');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = { app };
