var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require("fs");
var multer  = require('multer');

var index = require('./routes/index');
var users = require('./routes/users');
var test = require('./routes/test');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(multer({ dest: path.join(__dirname, 'workspace')}).array('image'));

app.use('/', index);
app.use('/users', users);
app.use('/test', test);


// for upload file;
app.get('/upload', function (req, res) {
    res.sendFile(path.join(__dirname, "public", "upload.html"));
});
app.post('/file_upload', function (req, res) {
       console.log(req.files[0]);

       console.log("****************************cutting line****************");

       var width = parseInt(req.body.width, 10);
       var height = parseInt(req.body.height, 10);
       if (isNaN(width) || isNaN(height)) {
           res.sendFile(path.join(__dirname, "public", "param_error.html"));
       }

       var des_file = path.join(__dirname, "workspace", req.files[0].originalname);
       console.log("destination file: " + des_file);
       fs.readFile(req.files[0].path, function (err, data) {
           fs.writeFile(des_file, data, function (err) {
               var response;
               if (err) {
                   console.log(err);
               } else {
                   response = {
                       "message":"File uploaded successfully",
                       "filename":req.files[0].originalname,
                       "width":width,
                       "height":height,
                   };
               }

               console.log(response);
               var jsonPretty = JSON.stringify(response, null, 2);
               res.end(jsonPretty);
           });
       });
});
 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
