'use strict';

/**
 * @ngdoc function
 * @name anthropoceneWebApp.controller:NetworkCtrl
 * @description
 * # NetworkCtrl
 * Controller of the anthropoceneWebApp
 */
angular.module('anthropoceneWebApp')
  .controller('NetworkCtrl', function ($scope, networkData, socket,$window,$timeout) {


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

    $timeout(function(){
      socket.emit('resetCreate')
    }, 400000)



  });
