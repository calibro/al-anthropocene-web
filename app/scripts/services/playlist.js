'use strict';

/**
 * @ngdoc service
 * @name anthropoceneWebApp.playlist
 * @description
 * # playlist
 * Service in the anthropoceneWebApp.
 */
angular.module('anthropoceneWebApp')
	.factory('playlistService', function ($q, $http) {
    var playlst = [];
    return {
        setPlaylist : function(pllst) {
            playlst = pllst;
        },
        getPlaylist : function() {
            return playlst;
        }
    }
});

