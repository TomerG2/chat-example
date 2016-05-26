  "use strict";

var module = angular.module("chatApp",[]);

module.controller("mainCtrl",
  ['$scope',function mainCtrl($scope){
    $scope.model = {
      online: [], //{sid: "/#HlIcBKJfugei7La6AAAw", user: "tomer", typing: true}
      messages: [], //{user: "tomer", message: "hello"}
      sid: null,
      user: null,
      message: null
    }

    var socket = io();

    $scope.send = function (){
      $scope.model.messages.push({user: $scope.model.user, message: $scope.model.message});
      socket.emit('chat message', $scope.model.user, $scope.model.message);
      socket.emit('end typing', $scope.model.user);
      $scope.model.message = "";
    };

    $scope.typing = function(){
      socket.emit('user typing', $scope.model.user);
    };

    socket.on('chat message', function(user_, msg_){
      $scope.$apply(function(){
        $scope.model.messages.push({user: user_, message: msg_});
      });
    });

    socket.on('save id', function(sid_){
      $scope.$apply(function(){
        $scope.model.sid = sid_;
      });
    });

    socket.on('user typing', function(sid_, user_){
      $scope.$apply(function(){
        let user = $scope.model.online.find(u => u.sid === sid_);
        if(user === undefined){
          $scope.model.online.push({sid: sid_, user: user_, typing: true});
        } else if(user.typing === false){
          user.typing = true;
        };
      });
    });

    socket.on('end typing', function(sid_, user){
      $scope.$apply(function(){
        let user = $scope.model.online.find(u => u.sid === sid_);
        if(user !== undefined){
          user.typing = false;
        };
      });
    });
}]);
