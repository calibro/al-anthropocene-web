'use strict';

/**
 * @ngdoc service
 * @name anthropoceneWebApp.socket
 * @description
 * # socket
 * Factory in the anthropoceneWebApp.
 */
angular.module('anthropoceneWebApp')
  .factory('socket', function (socketFactory) {

    var myIoSocket = io.connect('http://127.0.0.1:3000');
    //var myIoSocket = io.connect('gessicas-iMac.local:3000');

    var mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
  });

angular.module('anthropoceneWebApp').run(function(socket,$location,playlistService){
    socket.on("guiView",function(data){
        console.log("changed view to ",data);

        /*if(data.view == "play") {
        	$location.path("/player");
        }*/
        if(data.view == "create") {
        	$location.path("/network");
        }
    })

    socket.on("playlist",function(data){
    	playlistService.setPlaylist(data);
    	$location.path("/player");
    	//
    	//console.log(playlistService.getPlaylist());
    })
  });
