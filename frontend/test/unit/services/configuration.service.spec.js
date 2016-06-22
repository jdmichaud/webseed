require([], function () {
  'use strict';

  describe('confService', function () {
    var confService;
    var configuration = {
      then: function (callback) {
        callback({
          websocketSuffix: 'http://x.x.x.x',
          websocketPort: 8080,
          userLanguage: 'en',
        });
        return {
          catch: function (callback2) {
            return {};
          },
        };
      },
    };
    var restServiceMock = {
      getConfiguration: jasmine.createSpy('getConfiguration').and.returnValue(configuration),
      setConfiguration: jasmine.createSpy('setConfiguration'),
    };
    var logServiceMock = {
      debug: function () { },
      info: function () { },
      warn: function () { },
      error: function () { },
    };

    // Initialize the app
    beforeEach(module('WebseedApp'));

    // Configure the restServiceProvider
    beforeEach(module('WebseedApp', function ($provide) {
      $provide.value('logService', logServiceMock);
      $provide.value('restService', restServiceMock);
    }));

    // Retrieve the httpBackend which angular will use to simulate the http
    // API
    beforeEach(inject(function (_$httpBackend_, _confService_) {
      confService = _confService_;
    }));

    it('shall provide an API to retrieve the websocket URI', function () {
      expect(confService.getWebSocketServerUrl()).toBe('http://x.x.x.x');
      expect(confService.getWebSocketServerPort()).toBe(8080);
    });

    it('shall provide an API to retrieve the language', function () {
      expect(confService.getLanguage()).toBe('en');
    });
  });
});
