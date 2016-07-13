/**
 * Application routes are configured here.
 * The first route is the profile selection. In case of routing error, it is
 * the default route and acts as a way to reinitialize the client.
 * The main route displays the screen containing the views and the retractable
 * bottom bar.
 */
define('app.routes', ['app.modules'], function (application) {
  return function ($stateProvider, $urlRouterProvider) {
    // Configure the routes here
    $stateProvider
    .state('main', {
      url: '/',
      templateUrl: 'templates/scenario.html',
    });
    $urlRouterProvider.otherwise('/');
  };
});
