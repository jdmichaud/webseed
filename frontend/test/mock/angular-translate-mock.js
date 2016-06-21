define('mocks/translate-mock', function () {
  'use strict';

  // Translate mock
  return function ($provide, value) {
    var $translate = function (label) {
      return {
        then: function (callback) {
          callback(label);
          return {
            catch: function (callback2) { },
          };
        },
      };
    };
    $translate.storageKey = function () { return ''; };
    $translate.storage = function () {
      return { get: function () { return ''; } };
    };
    $translate.preferredLanguage = function () { return 'en'; };
    $translate.use = function () { };
    $translate.statefulFilter = function () { };
    $translate.instant = function (translationId, interpolateParams,
                                   interpolation, forceLanguage) { };
    $provide.value('$translate', $translate);
  };
});
