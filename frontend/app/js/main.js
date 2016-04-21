/* eslint indent: [0, 0] */

require(['app.modules', 'services/rest.service', 'services/log.service'],
        function (application, restServiceFactory, logServiceFactory) {
  'use strict';

  application.service('restService', restServiceFactory);
  application.service('logService', logServiceFactory);

  // Bootstrap the angular application
  angular.bootstrap(document, ['WebseedApp']);
});
