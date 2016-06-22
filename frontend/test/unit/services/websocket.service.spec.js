require([], function () {
  'use strict';

  describe('webSocketService', function () {
    var $httpBackend;
    var webSocketService;
    /**
     * The function executed by the webSocketServiceFactory upon resolving the
     * configuration object.
     * It shall be called at the beginning of each test so the tested service
     * can connect to the websocket server.
     */
    var webSocketServiceFactoryCallback;
    /** The configuration service mock object */
    var confServiceMock = {
      initPromise: {
        then: function (callback) {
          webSocketServiceFactoryCallback = callback;
        },
      },
      getWebSocketServerUrl: function () {
        return 'http://x.x.x.x';
      },
      getWebSocketServerPort: function () {
        return 8080;
      },
    };
    /** The standard WebSocket mock object */
    var webSocketMock = {
      addr: '',
      send: jasmine.createSpy('send'),
      // Generate a message from the WebSocket server with an arbitrary object
      sendData: function (obj) {
        this.onmessage(obj);
      },
    };
    // The WebSocket object constructor spy
    var webSocketConstructorSpy;
    // The modelService mock
    var modelServiceMock = {
      update: jasmine.createSpy('update'),
    };
    // For spying on $broadcast
    var $rootScope;

    // Silence logging
    var logServiceMock = {
      debug: function () { },
      info: function () { },
      warn: function () { },
      error: function () { },
    };

    // Initialize the app
    beforeEach(module('WebseedApp'));

    // Configure the provider
    beforeEach(module('WebseedApp', function ($provide) {
      // Configure the confServiceProvider
      $provide.value('confService', confServiceMock);
      // Configure the modelServiceProvider
      $provide.value('modelService', modelServiceMock);
      // Initialize the app
      $provide.value('logService', logServiceMock);
      // Mock the Websocket object
      webSocketConstructorSpy = spyOn(window, 'WebSocket').and.callFake(function (addr) {
        webSocketMock.addr = addr;
        return webSocketMock;
      });
    }));

    beforeEach(inject(function (_$rootScope_, _webSocketService_) {
      // Retrieve the service to test
      webSocketService = _webSocketService_;
      $rootScope = _$rootScope_;
      $rootScope.$broadcast = jasmine.createSpy('$broadcast').and.callThrough();
    }));

    it('shall wait on the confService promise and once resolved ' +
       'shall connect to the websocket server', function () {
      // Check that webSocketService hasn't tried to connect yet
      expect(webSocketConstructorSpy).not.toHaveBeenCalled();
      // Resolve the configuration service
      webSocketServiceFactoryCallback(confServiceMock);
      // Check that webSocketService has tried to connect to the proper address
      expect(webSocketConstructorSpy).toHaveBeenCalledWith('ws://localhost:' +
        confServiceMock.getWebSocketServerPort() + '/' + confServiceMock.getWebSocketServerUrl()
      );
    });

    it('shall implement an API to retrieve the complete scope', function () {
      webSocketServiceFactoryCallback(confServiceMock);
      // Send some data through the mock of a websocket
      webSocketMock.sendData({ data: JSON.stringify({ key: 'value' }) });
      // Expect the update method to have been called
      expect(modelServiceMock.update).toHaveBeenCalledWith({ key: 'value' });
    });

    it('shall update the scope as messages are being received', function () {
      webSocketServiceFactoryCallback(confServiceMock);
      // Send some data through the mock of a websocket
      webSocketMock.sendData({ data: JSON.stringify({ key: 'value' }) });
      expect(modelServiceMock.update).toHaveBeenCalledWith({ key: 'value' });
      // Update the data
      webSocketMock.sendData({ data: JSON.stringify({ key: 'value2' }) });
      // Check scope is updated
      expect(modelServiceMock.update).toHaveBeenCalledWith({ key: 'value2' });
    });

    it('shall broadcast a message on the rootScrope specifying which root node' +
       ' of the model has been updated', function () {
      webSocketServiceFactoryCallback(confServiceMock);
      // Check no broadcast performed
      expect($rootScope.$broadcast).not.toHaveBeenCalled();
      // Send some data through the mock of a websocket
      webSocketMock.sendData({ data: JSON.stringify({ key1: 'value', key2: { key3: 'value' } }) });
      // Check broadcast performed
      expect($rootScope.$broadcast.calls.count()).toEqual(2);
      expect($rootScope.$broadcast.calls.allArgs()).toEqual([['WebSocketService.message', 'key1'],
                                                             ['WebSocketService.message', 'key2']]);
    });

    it('shall broadcast a message on connection close', function () {
      webSocketServiceFactoryCallback(confServiceMock);
      // Close connection
      webSocketMock.onclose({ code: 12 });
      // Expect close message to have been broadcasted
      expect($rootScope.$broadcast).toHaveBeenCalledWith('WebSocketService.onclose');
    });

    it('shall broadcast a message on connection error', function () {
      webSocketServiceFactoryCallback(confServiceMock);
      // Close connection
      webSocketMock.onerror({ code: 12, reason: 'some reason' });
      // Expect error message to have been broadcasted
      expect($rootScope.$broadcast).toHaveBeenCalledWith('WebSocketService.onerror');
    });
  });
});
