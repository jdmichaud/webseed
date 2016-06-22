define('app.modules', function () {
  // Create the angular application
  var WebseedApp = angular.module('WebseedApp', ['ui.router',
                                  'ui.bootstrap',
                                  'pascalprecht.translate']);
  // Only return the application. The other modules will be accessible through
  // the angular,module API anyway.
  return WebseedApp;
});
