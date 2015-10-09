'use strict';

/**
 * @ngdoc service
 * @name anthropoceneWebApp.socket
 * @description
 * # socket
 * Factory in the anthropoceneWebApp.
 */
angular.module('anthropoceneWebApp')
  .factory('socket', function () {

    var myIoSocket = io.connect('http://localhost');

    mySocket = socketFactory({
        ioSocket: myIoSocket
    });

    return mySocket;
  });
