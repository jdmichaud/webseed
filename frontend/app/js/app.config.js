define('app.config', ['app.modules', 'app.routes'], function (application, routes) {
  application.config(['$stateProvider'], function ($stateProvider) {
    // Configure the routes
    routes.configure($stateProvider);
  });

  return {};
});
