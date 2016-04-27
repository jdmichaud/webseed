/* eslint no-use-before-define: 0 */

define('services/websocket.service', function () {
  /**
   * Services in charge of providing a dynamic data model, updated at the
   * server's inititive through a websocket.
   * @exports services/websocket.service
   */
  'use strict';

  var webSocketServiceFactory = function (jQuery, logService) {
    /** The websocket service */
    var webSocketService = {};
    /** The websocket object used for actual communication with the server */
    var webSocket;
    /** The global model which the other service and controller will link to */
    webSocketService.model = {};

    // Initialize websocket connection as soon as the configuration is resolved
    function initialize() {
      webSocketService.websocketURI = 'ws://192.168.1.100:8888';
      logService.info('Connecting to websocket server on ',
                      webSocketService.websocketURI);
      webSocket = new WebSocket(webSocketService.websocketURI);
      // Setup the event callback
      webSocket.onopen = onOpen;
      webSocket.onclose = onClose;
      webSocket.onerror = onError;
      webSocket.onmessage = onMessage;
    }
    initialize();

    /**
     * Represent the promise of the first reception of the model.
     * @access public
     */
    webSocketService.initPromise = new Promise(function (resolve, reject) {
      /** resolve/reject method of the initPormise. */
      webSocketService.initResolve = resolve;
      webSocketService.initReject = reject;
    });

    /**
     * Returns the model which contain the data send by the server through the
     * websocket.
     * @returns {Object} - A model object of arbitrary structure
     * @access public
     */
    webSocketService.getModel = function getModel() {
      return webSocketService.model;
    };

    /**
     * Callback used by the webSocket object once connection is open.
     * @access private
     */
    function onOpen(event) {
      logService.info('Websocket connection opened with ',
        webSocketService.websocketURI
      );
    }

    /**
     * Callback used by the webSocket object once connection is closed.
     * @access private
     */
    function onClose(event) {
      logService.info('Websocket connection closed with ',
        webSocketService.websocketURI, ' with following event code: ',
        event.code, ' and reason: ', event.reason
      );
      // If we never received any model, seomthing must be wrong so fail on the
      // promise
      if (jQuery.isEmptyObject(webSocketService.model)) {
        webSocketService.initReject();
      }
    }

    /**
     * Callback used by the webSocket object on error raised.
     * @access private
     */
    function onError(event) {
      logService.info('Websocket error with ',
        webSocketService.websocketURI, ' with following event: ', event
      );
    }

    /**
     * Callback used by the webSocket object on message reception.
     * @access private
     */
    function onMessage(message) {
      logService.debug('Websocket message received: ', message.data);
      var firstMessage = jQuery.isEmptyObject(webSocketService.model);
      jQuery.extend(true, webSocketService.model, message);
      // If the model was empty, we can assume it is the first reception so
      // we resolve the promise.
      if (firstMessage) {
        webSocketService.initResolve(webSocketService.model);
      }
    }

    return webSocketService;
  };

  return webSocketServiceFactory;
});
