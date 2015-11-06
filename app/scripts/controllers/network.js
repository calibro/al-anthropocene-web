'use strict';

/**
 * @ngdoc function
 * @name anthropoceneWebApp.controller:NetworkCtrl
 * @description
 * # NetworkCtrl
 * Controller of the anthropoceneWebApp
 */
angular.module('anthropoceneWebApp')
  .controller('NetworkCtrl', function ($scope, networkData, socket,$window, Idle) {
    
    Idle.watch();

    $scope.netData = networkData;
    $scope.nodeSelected = [];

    socket.on('entities', function(data){
      $scope.nodeSelected = data.entities;
    });

    socket.on("resetCreate",function(data){
      //console.log("refrash")
      $window.location.reload();
    })

    socket.on("reset",function(data){
      //console.log("refrash reset")
      $window.location.reload();
    })

    $scope.$on('IdleStart', function() {
      //console.log("ciao")
        socket.emit('resetCreate');// the user appears to have gone idle
        Idle.watch();
    });


  });
