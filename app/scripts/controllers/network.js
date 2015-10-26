'use strict';

/**
 * @ngdoc function
 * @name anthropoceneWebApp.controller:NetworkCtrl
 * @description
 * # NetworkCtrl
 * Controller of the anthropoceneWebApp
 */
angular.module('anthropoceneWebApp')
  .controller('NetworkCtrl', function ($scope, networkData, socket,$window) {
    $scope.netData = networkData;
    $scope.nodeSelected = [];

    socket.on('entities', function(data){
      $scope.nodeSelected = data.entities;
    });

    socket.on("resetCreate",function(data){
      $window.location.reload();
    })
  });
