/* eslint indent: [0, 0] */

require(['app.modules', 'services/rest.service', 'services/log.service',
         'services/configuration.service', 'services/websocket.service'],
        function (application, restServiceFactory, logServiceFactory,
                  configurationServiceFactory, webSocketServiceFactory) {
  'use strict';

  // Create a jQuery pseudo-service
  application.factory('jQuery', ['$window', function ($window) {
    return $window.jQuery;
  }]);
  application.service('restService', restServiceFactory);
  application.service('logService', logServiceFactory);
  application.service('confService', configurationServiceFactory);
  application.service('webSocketService', webSocketServiceFactory);

  // Bootstrap the angular application
  angular.bootstrap(document, ['WebseedApp']);
});
