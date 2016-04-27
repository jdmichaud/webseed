require([], function () {
  'use strict';

  describe('webSocketService', function () {
    var $httpBackend;
    var webSocketService;
    /** The standard WebSocket mock object */
    var webSocketMock = {
      addr: '',
      send: jasmine.createSpy('send'),
      callCBs: function () {
        // Call the callback provided
        this.onopen();
        this.onclose();
        this.onerror();
      },
      // Generate a message from the WebSocket server with an arbitrary object
      sendData: function (obj) {
        this.onmessage(obj);
      },
    };
    // The WebSocket object constructor spy
    var webSocketConstructorSpy;

    // Initialize the app
    beforeEach(module('WebseedApp'));

    // Configure the provider
    beforeEach(module('WebseedApp', function ($provide) {
      // Mock the Websocket object
      webSocketConstructorSpy = spyOn(window, 'WebSocket').and.callFake(function (addr) {
        webSocketMock.addr = addr;
        return webSocketMock;
      });
    }));

    beforeEach(inject(function (_$httpBackend_, _webSocketService_) {
      // Retrieve the service to test
      webSocketService = _webSocketService_;
    }));

    it('shall implement an API to retrieve the complete scope', function () {
      // Send some data through the mock of a websocket
      webSocketMock.sendData({ key: 'value' });
      // Check that getModel returns a Promise resolving to the data sent
      expect(webSocketService.getModel()).toEqual({ key: 'value' });
    });

    it('shall update the scope as messages are being received', function () {
      // Check that getModel returns a Promise resolving to the data sent
      var scope = webSocketService.getModel();
      // Send some data through the mock of a websocket
      webSocketMock.sendData({ key: 'value' });
      expect(scope).toEqual({ key: 'value' });
      // Update the data
      webSocketMock.sendData({ key: 'value2' });
      // Check scope is updated
      expect(scope).toEqual({ key: 'value2' });
    });

    it('shall resolve the initPromise at reception of the first message', function (done) {
      var promiseResolved = jasmine.createSpy('promiseResolved');
      webSocketService.initPromise.then(function () {
        promiseResolved();
        done();
      });
      // initPromise not yet resolved
      expect(promiseResolved).not.toHaveBeenCalled();
      // Send some data through the mock of a websocket
      webSocketMock.sendData({ key: 'value' });
      // Will timetout if initPromise.then function not called
    });

    it('shall reject the initPromise id connections closes and no model received', function (done) {
      var promiseRejected = jasmine.createSpy('promiseRejected');
      webSocketService.initPromise.catch(function () {
        promiseRejected();
        done();
      });
      // initPromise not yet resolved
      expect(promiseRejected).not.toHaveBeenCalled();
      // Send some data through the mock of a websocket
      webSocketMock.onclose({ code: 2, reason: 'unknown' });
      // Will timetout if initPromise.then function not called
    });
  });
});
