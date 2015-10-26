'use strict';

/**
 * @ngdoc service
 * @name anthropoceneWebApp.media
 * @description
 * # media
 * Service in the anthropoceneWebApp.
 */
angular.module('anthropoceneWebApp')
.factory('mediaService', function ($q, $http) {
    var baseurl = 'videos/';
    return {
        getVideoUrl : function(id) {
            return baseurl + id + ".mp4";
        },
        getThumbUrl : function(videoId, chunkId) {
            var thumburl = "antropovids/thumbs/output/";
            chunkId = chunkId.replace(videoId+"-","");
            var ch = chunkId.split("-")[0];
            return baseurl + thumburl + videoId + "/chunk-" + (parseInt(ch)+1) + "-sh-2.png";
        }

    }
  });
