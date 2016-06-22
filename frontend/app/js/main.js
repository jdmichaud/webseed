/* eslint indent: [0, 0] */

require(['app.modules', 'services/rest.service', 'services/log.service',
         'services/configuration.service', 'services/websocket.service',
         'services/model.service'],
        function (application, restServiceFactory, logServiceFactory,
                  confServiceFactory, webSocketServiceFactory,
                  modelServiceFactory) {
  'use strict';

  // Create a jQuery pseudo-service
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
  // Bootstrap the angular application
  angular.bootstrap(document, ['WebseedApp']);
});
