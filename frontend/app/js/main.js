/* eslint indent: [0, 0] */

require(['app.modules', 'app.constants', 'app.config', 'services/rest.service',
         'services/log.service', 'services/configuration.service',
         'services/websocket.service', 'services/model.service'],
        function (application, constants, configure, restServiceFactory,
                  logServiceFactory, confServiceFactory,
                  webSocketServiceFactory, modelServiceFactory) {
  'use strict';

  // Create third-party non angular pseudo-services
  application.factory('jQuery', ['$window', function ($window) {
    return $window.jQuery;
  }]);
  application.factory('lodash', ['$window', function ($window) {
    return $window._;
  }]);
  // Register the application's services
  application.service('restService', restServiceFactory);
  application.service('logService', logServiceFactory);
  application.service('confService', confServiceFactory);
  application.service('webSocketService', webSocketServiceFactory);
  application.service('modelService', modelServiceFactory);
  // Configure the application
  application.config(['$translateProvider', '$stateProvider', '$urlRouterProvider', configure]);
  // Bootstrap the angular application
  angular.bootstrap(document, ['WebseedApp']);
});
