'use strict';

/**
 * @ngdoc overview
 * @name anthropoceneWebApp
 * @description
 * # anthropoceneWebApp
 *
 * Main module of the application.
 */
angular
  .module('anthropoceneWebApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'btford.socket-io',
    'angular-loading-bar'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/network', {
        templateUrl: 'views/network.html',
        controller: 'NetworkCtrl',
        controllerAs: 'network'
      })
      .when('/player', {
        templateUrl: 'views/player.html',
        controller: 'PlayerCtrl',
        controllerAs: 'player'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
