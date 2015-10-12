'use strict';

/**
 * @ngdoc function
 * @name anthropoceneWebApp.controller:NetworkCtrl
 * @description
 * # NetworkCtrl
 * Controller of the anthropoceneWebApp
 */
angular.module('anthropoceneWebApp')
  .controller('NetworkCtrl', function ($scope, networkData) {
    $scope.netData = networkData;
    $scope.nodeSelected = []
  });
