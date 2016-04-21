define('services/rest.service', function () {
  /**
   * Facility to perform rest calls on the server.
   * Can return Promise or not depending on the nature of the API.
   * @exports services/rest.service
   */
  'use strict';

  /** Define the URLs the restService is going to use */
  var urls = {
    x: '/some/X/url',
    log: '/log',
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

    return restService;
  };
});
