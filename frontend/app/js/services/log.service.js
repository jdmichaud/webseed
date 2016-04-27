define('services/log.service', function () {
  /**
   * Allow client javascript code to log action, warnings or errors on the
   * server in a consolidated way.
   * @exports services/log.service
   */
  'use strict';

  var logServiceFactory = function (restService) {
    /** The log service */
    var logService = {};

    /**
     * Log an error message on the server
     * @access public
     * @param message to be logged
     */
    logService.error = function (message) {
      return new Promise(function (resolve, reject) {
        StackTrace.get().then(function (stackframes) {
          console.log(stackframes);
          logService.log(message,
                         1,
                         Date.now(),
                         stackframes[2].fileName,
                         stackframes[2].lineNumber,
                         stackframes[2].columnNumber);
          resolve();
        }).catch(function (data) {
          reject(data);
        });
      });
    };

    /**
     * Log an warning message on the server
     * @access public
     * @param message to be logged
     */
    logService.warning = function (message) {
      StackTrace.get().then(function (stackframes) {
        logService.log(message,
                       2,
                       Date.now(),
                       stackframes[2].fileName,
                       stackframes[2].lineNumber,
                       stackframes[2].columnNumber);
      });
    };

    /**
     * Log an info message on the server
     * @access public
     * @param message to be logged
     */
    logService.info = function (message) {
      StackTrace.get().then(function (stackframes) {
        logService.log(message,
                       3,
                       Date.now(),
                       stackframes[2].fileName,
                       stackframes[2].lineNumber,
                       stackframes[2].columnNumber);
      });
    };

    /**
     * Log an debug message on the server
     * @access public
     * @param message to be logged
     */
    logService.debug = function (message) {
      StackTrace.get().then(function (stackframes) {
        logService.log(message,
                       4,
                       Date.now(),
                       stackframes[2].fileName,
                       stackframes[2].lineNumber,
                       stackframes[2].columnNumber);
      });
    };

    /** @access private */
    logService.log = function (message, level, timestamp, file, line, column) {
      // TODO: Log also on the console for now. See if we want to keep that.
      console.log(message, file, line);
      restService.log({
        message: message,
        level: level,
        timestamp: timestamp,
        file: file,
        line: line,
        column: column,
      });
    };

    return logService;
  };

  return logServiceFactory;
});
