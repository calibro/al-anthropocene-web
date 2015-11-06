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
    'com.2fdevs.videogular',
    'angular-loading-bar',
    'ngIdle'
  ])
  .config(function ($routeProvider, IdleProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/network.html',
        controller: 'NetworkCtrl',
        controllerAs: 'network',
        resolve:{
          networkData: function(apiService){
            return apiService.getNetwork()
          }
        }
      })
      .when('/player', {
        templateUrl: 'views/player.html',
        controller: 'PlayerCtrl',
        controllerAs: 'player'
      })
      .otherwise({
        redirectTo: '/'
      });

        IdleProvider.idle(300);
  })
  .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
  }])
