/* eslint indent: [0, 0] */

define('app.config', ['app.modules', 'app.routes'], function (application, configureRoute) {
  return function ($translateProvider, $stateProvider, $urlRouterProvider) {
    // Configure the internationalization sub-system
    $translateProvider
      .useStaticFilesLoader({
        prefix: 'resources/locales/locale-',
        suffix: '.json',
      })
      .preferredLanguage('en')
      .useSanitizeValueStrategy('escape');
    // Configure the routes
    configureRoute($stateProvider, $urlRouterProvider);
  };
});
