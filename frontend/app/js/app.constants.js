/*
 * Application constants.
 */
define('app.constants', ['app.modules'], function (application) {
  // define a constant that can be used anywhere with injection
  application.constant('someContant', 1000);
});
