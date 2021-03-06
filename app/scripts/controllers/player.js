'use strict';

/**
 * @ngdoc function
 * @name anthropoceneWebApp.controller:PlayerCtrl
 * @description
 * # PlayerCtrl
 * Controller of the anthropoceneWebApp
 */
angular.module('anthropoceneWebApp')
  .controller('PlayerCtrl', function ($scope,$sce,mediaService, playlistService,socket,$interval, $timeout,$location) {


  	$scope.controller = this;
    $scope.controller.state = null;
    $scope.controller.API = null;
    $scope.controller.currentVideo = 0;
    $scope.hide=false;

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
        autoPlay: "false"
    };

      $scope.controller.setVideo = function(index, notify) {

              $scope.hide = false;
              $scope.controller.currentVideo = index;
            	$scope.chunk = $scope.chunks[$scope.controller.currentVideo];

              if(notify) {
                socket.emit("playChunk", $scope.chunk.id);
              }

              $scope.controller.config.sources = [{src: $sce.trustAsResourceUrl(mediaService.getVideoUrl($scope.chunk.videoId)), type: "video/mp4"}]
              $scope.controller.API.changeSource($scope.controller.config.sources);

            };

    $scope.$watchCollection('chunks',function(newValue,oldValue){
		console.log(newValue);
	    if(newValue.length) {
        $scope.controller.setVideo(0,false);
    	}

    })

    $scope.playVideo = function(source) {
      $scope.controller.API.seekTime(parseInt($scope.chunk.start));
      //$scope.controller.API.play();

      console.log($scope.controller.API.currentTime/1000, "timing after load");

      $timeout(function(){
        $scope.hide = true;
      },3000)

      $timeout(function(){
        $scope.controller.checkTime();
      },100);

    }


    $scope.controller.checkTime = function() {


            if($scope.controller.API.currentTime/1000 >= $scope.chunk.end) {

                $scope.controller.API.stop();

              if($scope.controller.currentVideo < $scope.chunks.length-1) {
                  $scope.controller.setVideo($scope.controller.currentVideo + 1, true);
                }
                else {
                console.log("finished!");
                  $timeout(socket.emit("backToCreate",{}));
                }

            }
            else if($location.path()=="/player"){
              //emitting time status
              socket.emit("playTime",{"time":(($scope.controller.API.currentTime/1000-$scope.chunk.start)/$scope.chunk.duration)*100,"video":$scope.chunk.id});

            	$timeout($scope.controller.checkTime,500)

            }
        }

    socket.on("playStatus",function(data){
      if(data=="pause") {
        $scope.hide = false;
        $scope.controller.API.pause();
      }
      else if(data == "play") {
        $timeout(function(){
          $scope.hide = true;
        },5000)
        $scope.controller.API.play();
      }
    })

    socket.on("playChunk",function(data) {

      var ind = $scope.chunks.findIndex(function(d){return d.id == data});
      $scope.controller.setVideo(ind,false);

    })


  });
