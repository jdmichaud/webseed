define('services/log.service', function () {
  /**
   * Allow client javascript code to log action, warnings or errors on the
   * server in a consolidated way.
   * @exports services/log.service
   */
  'use strict';

  return function (restService) {
    /** The log service */
    var logService = {};

    /**
     * Log an error message on the server
     * @access public
     * @param message to be logged
     */
    logService.error = function (message) {

    };

    /**
     * Log an warning message on the server
     * @access public
     * @param message to be logged
     */
    logService.warning = function (message) {

    };

    /**
     * Log an info message on the server
     * @access public
     * @param message to be logged
     */
    logService.info = function (message) {

    };

    /**
     * Log an debug message on the server
     * @access public
     * @param message to be logged
     */
    logService.debug = function (message) {

    };

    /** @access private */
    logService.log = function (message) {

    };

    return logService;
  };
});
