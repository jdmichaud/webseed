define('services/rest.service', function () {
  /**
   * Facility to perform rest calls on the server.
   * Can return Promise or not depending on the nature of the API.
   * @exports services/rest.service
   */
  'use strict';

  /**
   * Define the URLs the restService is going to use
   * @access private
   */
  var urls = {
    x: '/some/X/url',
    log: '/log',
    configuration: '/uxcast/conf-provider/configuration',
  };

  return function ($http) {
    /** The rest service */
    var restService = {};

    /**
     * Some example function returning a Promise
     * @access public
     * @param username
     * @param password
     */
    restService.x = function x(username, password) {
      return new Promise(function (resolve, reject) {
        $http.post(urls.x, {
          username: username,
          password: password,
        }).then(function (data) {
          resolve(data);
        }, function (data) {
          reject(data);
        });
      });
    };

    /**
     * Calls the log URL and provide an arbitrary logging structure
     * @access public
     * @param logStruct - the structure that the server will decode to otain the
     *                    trace information
     */
    restService.log = function log(logStruct) {
      $http.put(urls.log, logStruct)
      .then(function () {}, function () {
        console.error('Could not log message. Server error.');
      });
    };

    /**
     * Retrieve the configuration object from the server
     * @access public
     * @returns {Object} - A promise resolving the object retrieved
     */
    restService.getConfiguration = function getConfiguration() {
      return new Promise(function (resolve, reject) {
        $http.get(urls.configuration).then(function (data) {
          resolve(data.data);
        }, function (data) {
          reject(data);
        });
      });
    };

    /**
     * Set the configuration. The configuration object is a arbitrary structure
     * defined by the configuration service.
     * @access public
     * @params {Object} - An arbitrary structure
     */
    restService.setConfiguration = function setConfiguration(configuration) {
      return new Promise(function (resolve, reject) {
        $http.put(urls.configuration, configuration).then(function (data) {
          resolve(data.data);
        }, function (data) {
          reject(data);
        });
      });
    };

    return restService;
  };
});
