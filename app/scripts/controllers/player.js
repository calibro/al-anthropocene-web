'use strict';

/**
 * @ngdoc function
 * @name anthropoceneWebApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the anthropoceneWebApp
 */
angular.module('anthropoceneWebApp')
  .controller('PlayerCtrl', function ($scope,$sce,mediaService, playlistService,socket,$interval, $timeout) {
  
  	$scope.controller = this;
    $scope.controller.state = null;
    $scope.controller.API = null;
    $scope.controller.currentVideo = 0;

    $scope.chunks = playlistService.getPlaylist();
    
var timeIntvl = null;

    $scope.controller.onPlayerReady = function(API) {

        $scope.controller.API = API;
        $scope.controller.API.setVolume(1);
    };


    $scope.controller.config = {
        /*sources: [
            {src: $sce.trustAsResourceUrl(mediaService.getVideoUrl($scope.chunk.videoId)), type: "video/mp4"}
        ],*/
        theme: {
            url: "http://www.videogular.com/styles/themes/default/latest/videogular.css"
        },
        preload: "none",
        width:640,
        height:480,
        autoPlay: "autoplay"
    };

      $scope.controller.setVideo = function(index) {
        		       
                $scope.controller.currentVideo = index;
            	$scope.chunk = $scope.chunks[$scope.controller.currentVideo];

            	socket.emit("playChunk",$scope.chunk.id);

                $scope.controller.config.sources = [{src: $sce.trustAsResourceUrl(mediaService.getVideoUrl($scope.chunk.videoId)), type: "video/mp4"}]
		    	$scope.controller.API.seekTime(parseInt($scope.chunk.start));
				$scope.controller.API.play();
                $scope.controller.checkTime();
                
            };

    $scope.$watchCollection('chunks',function(newValue,oldValue){
		console.log(newValue);	    	
	    if(newValue.length) {
			
		    $scope.chunk = newValue[$scope.controller.currentVideo];
		    $scope.controller.config.sources = [{src: $sce.trustAsResourceUrl(mediaService.getVideoUrl($scope.chunk.videoId)), type: "video/mp4"}]
		    $scope.controller.API.seekTime(parseInt($scope.chunk.start));
    		$scope.controller.API.play();
    		$scope.controller.checkTime();
    	}

    })

    $scope.controller.checkTime = function() {
    	
    	

            console.log($scope.controller.API.currentTime/1000);
            
            if($scope.controller.API.currentTime/1000 > $scope.chunk.end) {
                $scope.controller.API.stop();
                $scope.controller.setVideo($scope.controller.currentVideo+1);
            }
            else{
            	$timeout($scope.controller.checkTime,1000)
            }
        }



  });
