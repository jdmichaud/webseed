require([], function () {
  'use strict';

  describe('restService', function () {
    var $httpBackend;
    var restService;

    // Initialize the app
    beforeEach(module('WebseedApp'));

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

    it('shall implements the X API', function (done) {
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

    it('shall implements the log API', function () {
      restService.log({ message: 'this is a log message', level: 2 });
      // Expect to be called with the arbitrary log structure
      $httpBackend.expectPUT('/log', {
        message: 'this is a log message',
        level: 2,
      }).respond(200, {});
      $httpBackend.flush();
    });
  });
});
