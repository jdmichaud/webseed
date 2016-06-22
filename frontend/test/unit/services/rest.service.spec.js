require(['mocks/translate-mock'], function ($translateProviderMock) {
  'use strict';

  describe('restService', function () {
    var $httpBackend;
    var restService;
    var logServiceMock = {
      debug: function () { },
      info: function () { },
      warn: function () { },
      error: function () { },
    };

    // Initialize the app
    beforeEach(module('WebseedApp'));

    // Configure the providers
    beforeEach(module('WebseedApp', function ($provide) {
      $provide.value('logService', logServiceMock);
      $translateProviderMock($provide);
    }));

    // Retrieve the httpBackend which angular will use to simulate the http
    // API
    beforeEach(inject(function (_$httpBackend_, _restService_) {
      $httpBackend = _$httpBackend_;
      restService = _restService_;
    }));

    // Tidy-up the http API to make sure we haven't missed anything in our
    // testing
    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('shall implement the X API', function (done) {
      // Call the X API
      restService.x('robert@redford.com', 'pencil42').then(function (data) {
        // You can write some expectation on the service state here.
        done();
      }).catch(function () {
        expect(true).toBe(false); // Should not pass here
        done();
      });
      // Expect to be called and return
      $httpBackend.expectPOST('/some/X/url', {
        username: 'robert@redford.com',
        password: 'pencil42',
      }).respond(200, {
        result: true,
        user: {
          username: 'robert@redford.com',
          isAdmin: false,
        },
      });
      $httpBackend.flush();
    });

    it('shall implement the log API', function () {
      restService.log({ message: 'this is a log message', level: 2 });
      // Expect to be called with the arbitrary log structure
      $httpBackend.expectPUT('/log', {
        message: 'this is a log message',
        level: 2,
      }).respond(200, {});
      $httpBackend.flush();
    });

    it('shall implement the getConfiguration API', function (done) {
      var configuration = {
        key: 'value',
      };
      restService.getConfiguration().then(function (retrievedConfiguration) {
        expect(retrievedConfiguration).toEqual(configuration);
        done();
      }).catch(function () {
        expect(false).toBe(true);
        done();
      });
      $httpBackend
        .expectGET('/uxcast/conf-provider/configuration')
        .respond(200, configuration);
      $httpBackend.flush();
    });

    it('shall implement the setConfiguration API', function (done) {
      var configuration = { key: 'value' };
      restService.setConfiguration(configuration).then(function () {
        done();
      }).catch(function () {
        expect(false).toBe(true);
        done();
      });
      $httpBackend
        .expectPUT('/uxcast/conf-provider/configuration', configuration)
        .respond(200, {});
      $httpBackend.flush();
    });
  });
});
