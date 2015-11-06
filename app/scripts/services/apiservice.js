'use strict';

/**
 * @ngdoc service
 * @name anthropoceneWebApp.apiService
 * @description
 * # apiService
 * Factory in the anthropoceneWebApp.
 */
angular.module('anthropoceneWebApp')
  .factory('apiService', function ($q,$http) {

    //var baseUrl = 'http://dicto-ao.herokuapp.com/api/';
    var baseUrl = 'http://localhost:9000/api/';

    return {

       getFile : function(url){
         var deferred = $q.defer();
         $http.get(url).success(function(data){
           deferred.resolve(data);
         }).error(function(){
           deferred.reject("An error occured while fetching file");
         });

         return deferred.promise;
       },
       getNetwork : function(params){
         var serviceUrl = 'network';
         var deferred = $q.defer();

         $http({
              method: 'GET',
              url : baseUrl + serviceUrl,
              params : params
            })
          .success(function(data){
           deferred.resolve(data);
         }).error(function(){
           deferred.reject("An error occured while fetching file");
         });

         return deferred.promise;
       }
     }
  });
