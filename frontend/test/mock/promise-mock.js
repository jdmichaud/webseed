define('promise-mock', function () {
  'use strict';

  var handlers;

  return {
    createPromise: function () {
      handlers = [];
      return {
        then: function (f) {
          handlers.push({ type: 'then', fun: f });
          return this;
        },
        catch: function (f) {
          handlers.push({ type: 'catch', fun: f });
          return this;
        },
      };
    },
    resolve: function (data) {
      // In case of resolve, execute all the 'then' handler in order
      handlers.filter(function (handler) {
        return handler.type === 'then';
      }).forEach(function (handler) {
        handler.fun(data);
      });
    },
    reject: function (data) {
      // In case of reject, execute the first 'catch' handler and all the
      // subsequent 'then' handlers
      var firstCatch = handlers.findIndex(function (handler) {
        return handler.type === 'catch';
      });
      // Call the catch handler
      handlers[firstCatch].fun(data);
      // Call the subsequent then handlers
      handlers.slice(firstCatch + 1).filter(function (handler) {
        return handler.type === 'then';
      }).forEach(function (handler) {
        handler.fun(data);
      });
    },
  };
});
