/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

io.enable('browser client minification'); // send minified client
io.enable('browser client etag'); // apply etag caching logic based on version number
io.enable('browser client gzip'); // gzip the file
io.set('log level', 1); // reduce logging
io.set('transports', [ // enable all transports (optional if you want flashsocket)
'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);

// all environments
app.set('port', 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.get('/', routes.index(io));
app.use(express.static(path.join(__dirname, 'public')));

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});