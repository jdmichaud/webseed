require([], function () {
  'use strict';

  describe('logService', function () {
    var logService;
    var whatTimeIsIt = 'serenity now!';
    var stackFrame = {
      fileName: 'main.js',
      lineNumber: 44,
      columnNumber: 13,
    };
    var restServiceMock = {
      log: jasmine.createSpy('log'),
    };

    // Initialize the app
    beforeEach(module('WebseedApp'));

    // Configure the restServiceProvider
    beforeEach(module('WebseedApp', function ($provide) {
      $provide.value('restService', restServiceMock);
    }));

    // Retrieve the httpBackend which angular will use to simulate the http
    // API
    beforeEach(inject(function (_$httpBackend_, _logService_) {
      logService = _logService_;
    }));

    // Mock the global Date object and the Stacktrace object.
    beforeEach(function () {
      spyOn(Date, 'now').and.callFake(function () {
        return whatTimeIsIt;
      });
      spyOn(StackTrace, 'get').and.callFake(function () {
        return {
          then: function (callback) {
            callback([
              {}, {}, stackFrame,
            ]);
          },
        };
      });
    });

    it('shall call the rest api with the log structure', function () {
      var message = 'this is a message';
      var level = 1;
      var timestamp = 'some timestamp';
      var file = 'app.js';
      var line = 12;
      var column = 45;
      restServiceMock.log.calls.reset();
      logService.log(message, level, timestamp, file, line, column);
      expect(restServiceMock.log).toHaveBeenCalledWith({
        message: message,
        level: level,
        timestamp: timestamp,
        file: file,
        line: line,
        column: column,
      });
    });

    it('shall call log with level 1 on the restService when called on error', function () {
      var message = 'this is a message';
      var level = 1;
      restServiceMock.log.calls.reset();
      logService.error(message);
      expect(restServiceMock.log).toHaveBeenCalledWith({
        message: message,
        level: level,
        timestamp: whatTimeIsIt,
        file: stackFrame.fileName,
        line: stackFrame.lineNumber,
        column: stackFrame.columnNumber,
      });
    });

    it('shall call log with level 2 on the restService when called on warning', function () {
      var message = 'this is a message';
      var level = 2;
      restServiceMock.log.calls.reset();
      logService.warning(message);
      expect(restServiceMock.log).toHaveBeenCalledWith({
        message: message,
        level: level,
        timestamp: whatTimeIsIt,
        file: stackFrame.fileName,
        line: stackFrame.lineNumber,
        column: stackFrame.columnNumber,
      });
    });

    it('shall call log with level 3 on the restService when called on warning', function () {
      var message = 'this is a message';
      var level = 3;
      restServiceMock.log.calls.reset();
      logService.info(message);
      expect(restServiceMock.log).toHaveBeenCalledWith({
        message: message,
        level: level,
        timestamp: whatTimeIsIt,
        file: stackFrame.fileName,
        line: stackFrame.lineNumber,
        column: stackFrame.columnNumber,
      });
    });

    it('shall call log with level 2 on the restService when called on warning', function () {
      var message = 'this is a message';
      var level = 4;
      restServiceMock.log.calls.reset();
      logService.debug(message);
      expect(restServiceMock.log).toHaveBeenCalledWith({
        message: message,
        level: level,
        timestamp: whatTimeIsIt,
        file: stackFrame.fileName,
        line: stackFrame.lineNumber,
        column: stackFrame.columnNumber,
      });
    });
  });
});
