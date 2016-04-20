require([], function () {
  'use strict';

  describe('logService', function () {
    var logService;
    var whatTimeIsIt = 'serenity now!';
    var stackFrame = {
      file: 'main.js',
      line: 44,
      column: 13,
    };
    var restServiceMock = {
      log: jasmine.createSpy('log');
    }

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
        return [
          {}, {}, stackFrame,
        ];
      });
    });

    it('shall call the rest api with the log structure', function (done) {
      message = 'this is a message';
      level = 1;
      timestamp = 'some timestamp';
      file = 'app.js';
      line = 12;
      column = 45;
      logService.log(message, level, timestamp, file, line, column);
      expect(restService.log).toHaveBeenCalledWith({
        message: message,
        level: level,
        timestamp: timestamp,
        file: file,
        line: line,
        column: column,
      });
    });

    it('shall call log with level 1 on the restService when called on error', function () {
      message = 'this is a message';
      logService.error(message);
      expect(restService.log).toHaveBeenCalledWith({
        message: message,
        level: 1,
        timestamp: whatTimeIsIt,
        file: stackFrame.file,
        line: stackFrame.line,
        column: stackrame.column,
      });
    });

    it('shall call log with level 2 on the restService when called on warning', function () {
      message = 'this is a message';
      logService.warning(message);
      expect(restService.log).toHaveBeenCalledWith({
        message: message,
        level: 2,
        timestamp: whatTimeIsIt,
        file: stackFrame.file,
        line: stackFrame.line,
        column: stackrame.column,
      });
    });

    it('shall call log with level 3 on the restService when called on warning', function () {
      message = 'this is a message';
      logService.info(message);
      expect(restService.log).toHaveBeenCalledWith({
        message: message,
        level: 3,
        timestamp: whatTimeIsIt,
        file: stackFrame.file,
        line: stackFrame.line,
        column: stackrame.column,
      });
    });

    it('shall call log with level 2 on the restService when called on warning', function () {
      message = 'this is a message';
      logService.trace(message);
      expect(restService.log).toHaveBeenCalledWith({
        message: message,
        level: 4,
        timestamp: whatTimeIsIt,
        file: stackFrame.file,
        line: stackFrame.line,
        column: stackrame.column,
      });
    });
  })
});
