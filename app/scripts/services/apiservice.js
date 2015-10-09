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
    return {

       getFile : function(url){
         var deferred = $q.defer();
         $http.get(url).success(function(data){
           deferred.resolve(data);
         }).error(function(){
           deferred.reject("An error occured while fetching file");
         });

         return deferred.promise;
       }
     }
  });
