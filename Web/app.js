var fs = require('fs');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//var settings = JSON.parse(fs.readFileSync('settings.json'));

app.use('/static', express.static('static'));

app.get('/', function (req, res) {
  res.render('index.jade');
});

http.listen(80);