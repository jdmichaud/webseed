define('services/configuration.service', function () {
  /**
   * Allow to get configuration parameters and set some of them.
   * @exports services/configuration.service
   */
  'use strict';

  var confServiceFactory = function (logService, restService) {
    /** The configuration service */
    var confService = {};
    var configuration = {};

    /**
     * The initialization promise. The service cannot be considered ready as
     * long as this promise is not resolved. To be used in the resolve field
     * of your route.
     * @access public
     */
    confService.initPromise = restService.getConfiguration().then(function (data) {
      logService.debug('Configuration retrieved');
      configuration = data;
      return configuration;
    }).catch(function () {
      logService.error('Configuration retrieval failed');
    });

    /**
     * Returns the websocket url to be used when connecting to the
     * websocket server
     * @returns {Object} - Object with field url
     * @access public
     */
    confService.getWebSocketServerUrl = function () {
      return configuration.websocketSuffix;
    };

    /**
     * Returns the websocket port to be used when connecting to the
     * websocket server
     * @returns {Object} - Object with field port
     * @access public
     */
    confService.getWebSocketServerPort = function () {
      return configuration.websocketPort;
    };

    /**
     * Retusn the selected language.
     * @returns {String} - The selected language as a ISO 639-1 code
     * @access public
     */
    confService.getLanguage = function () {
      return configuration.userLanguage;
    };

    return confService;
  };

  return confServiceFactory;
});
