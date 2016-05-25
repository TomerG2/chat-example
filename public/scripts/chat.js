  "use strict";
  var socket = io();
  var sid = null;
  $('form').submit(function(){
    var user = ($('#user').val() || "user");
    var msg = $('#m').val();
    appendMessage(user, msg);
    socket.emit('chat message', user, msg);
    socket.emit('end typing', user);
    $('#m').val('');
    return false;
  });

  $('#m').keydown(function(){
    var user = ($('#user').val() || "user");
    socket.emit('user typing', user);
  });

  socket.on('save id', function(sid_){
    sid = sid_;
  });

  socket.on('chat message', function(user, msg){
    appendMessage(user, msg);
  });

  socket.on('user typing', function(sid, user){
    appendTyping(sid, user);
  });

  socket.on('end typing', function(sid, user){
    removeTyping(sid, user);
  });

  function appendMessage(user, msg){
    $('#messages').append($('<li>').text(user+ ": " + msg));
  };

  function appendTyping(sid, user){
    removeTyping(sid, user);
    var e = $('<li>').text(user + " is typing...");
    $('#typings').append(e);
    e.attr('id', user);
  };

  function removeTyping(sid, user){
    $('li#'+user).remove();
  };
