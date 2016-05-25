"use strict";
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var clients = {};
var system = "*** system ***";

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  clients[socket.id] = socket;

  socket.emit('save id', socket.id);

  socket.broadcast.emit('chat message', system, 'someone connected');

  socket.on('disconnect', function(){
    io.emit('chat message', system, 'someone disconnect');
  });

  socket.on('chat message', function(user, msg){
    socket.broadcast.emit('chat message', user, msg);
  });

  socket.on('user typing', function(user){
    socket.broadcast.emit('user typing', socket.id, user);
  });

  socket.on('end typing', function(user){
    socket.broadcast.emit('end typing', socket.id, user);
  });
});

http.listen(app.get('port'), function(){
  console.log('Node app is running on port', app.get('port'));
});
