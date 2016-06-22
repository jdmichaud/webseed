/* eslint no-use-before-define: 0 */

define('services/websocket.service', function () {
  /**
   * Services in charge of receiving data model from the server and update this
   * model while broadcasting notification upon updates
   * @exports services/websocket.service
   */
  'use strict';

  var webSocketServiceFactory = function ($rootScope, jQuery,
                                          logService, confService, modelService) {
    /** The websocket service */
    var webSocketService = {};
    /** The websocket object used for actual communication with the server */
    var webSocket;
    var websocketURI;

    // Initialize websocket connection as soon as the configuration is resolved
    confService.initPromise.then(function (configuration) {
      websocketURI = 'ws://' + location.hostname + ':' + confService.getWebSocketServerPort() +
                         '/' + confService.getWebSocketServerUrl();
      logService.info('Connecting to websocket server on ' + websocketURI);
      webSocket = new WebSocket(websocketURI);
      // Setup the event callback
      webSocket.onopen = onOpen;
      webSocket.onclose = onClose;
      webSocket.onerror = onError;
      webSocket.onmessage = onMessage;
    });

    /**
     * Callback used by the webSocket object once connection is open.
     * @access private
     */
    function onOpen(event) {
      logService.info('Websocket connection opened with ' + websocketURI);
    }

    /**
     * Callback used by the webSocket object once connection is closed.
     * @access private
     */
    function onClose(event) {
      logService.info('Websocket connection closed with ' + websocketURI,
        ' with following event code: ', event.code, ' and reason: ', event.reason
      );
      $rootScope.$broadcast('WebSocketService.onclose');
    }

    /**
     * Callback used by the webSocket object on error raised.
     * @access private
     */
    function onError(event) {
      logService.info('Websocket error with ' + websocketURI,
        ' with following event: ', event
      );
      $rootScope.$broadcast('WebSocketService.onerror');
    }

    /**
     * Callback used by the webSocket object on message reception.
     * @access private
     */
    function onMessage(message) {
      logService.debug('Websocket message received: ' + message.data);
      // Parse and merge the data
      var data = JSON.parse(message.data);
      modelService.update(data);
      // Broadcast messages to listening controller to call the digest loop
      for (var key in data) {
        // Make sure we are not listing properties from parent
        if ({}.hasOwnProperty.call(data, key)) {
          $rootScope.$broadcast('WebSocketService.message', key);
        }
      }
    }

    return webSocketService;
  };

  return webSocketServiceFactory;
});
