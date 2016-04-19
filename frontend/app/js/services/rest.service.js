define('services/rest.service', function () {
  'use strict';

  // Define the URLs the restService is going to use
  var webseedURLs = {
    x: '/some/X/url',
  };

  return function ($http) {
    var restService = {};

    restService.x = function x(username, password) {
      return new Promise(function (resolve, reject) {
        $http.post(webseedURLs.x, {
          username: username,
          password: password,
        }).then(function (data) {
          resolve(data);
        }, function (data) {
          reject(data);
        });
      });
    };

    return restService;
  };
});
