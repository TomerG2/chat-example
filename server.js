"use strict";
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var system = "system";

app.get('/', function(req, res){
  res.sendfile('index.html');
});

io.on('connection', function(socket){
  io.emit('chat message', system, 'someone connected');
  socket.on('disconnect', function(){
    io.emit('chat message', system, 'someone disconnect');
  });
  socket.on('chat message', function(nickname, msg){
    io.emit('chat message', nickname, msg);
  });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
