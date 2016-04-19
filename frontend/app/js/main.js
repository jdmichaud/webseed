require(['app.modules', 'services/rest.service'], function (application, restService) {
  'use strict';

  application.factory('restService', restService);
  // Bootstrap the angular application
  angular.bootstrap(document, ['WebseedApp']);
});
