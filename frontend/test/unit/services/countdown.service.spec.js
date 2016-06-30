require([], function () {
  'use strict';

  describe('countdownService', function () {
    // The service being tested
    var countdownService;
    // For spying on $broadcast
    var $rootScope;
    var setIntervalSpy;
    var clearIntervalSpy;
    var dateSpy;
    var tickFunction;
    var now;

    // Initialize the app
    beforeEach(module('UxcastApp'));
    // Configure the restServiceProvider
    beforeEach(module('UxcastApp', function ($provide) {
    }));
    beforeEach(inject(function (_$rootScope_, _countdownService_) {
      // Retrieve the service to test
      countdownService = _countdownService_;
      $rootScope = _$rootScope_;
      $rootScope.$broadcast = jasmine.createSpy('$broadcast').and.callThrough();
      setIntervalSpy = spyOn(window, 'setInterval').and.callFake(function (f, t) {
        tickFunction = f;
      });
      clearIntervalSpy = spyOn(window, 'clearInterval').and.callFake(function (name) { });
      dateSpy = spyOn(window, 'Date').and.callFake(function () {
        return {
          getTime: function () {
            return now;
          },
        };
      });
    }));

    it('shall create an anonymous counter', function () {
      var counter = countdownService.create(12000);
      expect(counter.value).toEqual(12000);
      expect(counter.countdown).toEqual(12000);
      expect(counter.resolution).toEqual(1000);
      expect(counter.running).toEqual(false);
    });

    it('shall create an named counter', function () {
      var counter = countdownService.create(12000, 'someName');
      expect(counter.value).toEqual(12000);
      expect(counter.countdown).toEqual(12000);
      expect(counter.resolution).toEqual(1000);
      expect(counter.running).toEqual(false);
    });

    it('shall create a counter with millisecond resolution', function () {
      var counter = countdownService.create(12000, 'someName', 2);
      expect(counter.value).toEqual(12000);
      expect(counter.countdown).toEqual(12000);
      expect(counter.resolution).toEqual(1);
      expect(counter.running).toEqual(false);
    });

    it('shall overwrite an named counter', function () {
      var counter = countdownService.create(12000, 'someName', 2);
      counter = countdownService.create(26000, 'someName');
      expect(counter.value).toEqual(26000);
      expect(counter.countdown).toEqual(26000);
      expect(counter.resolution).toEqual(1000);
      expect(counter.running).toEqual(false);
    });

    it('shall start a counter', function () {
      var counter = countdownService.create(12000);
      countdownService.start();
      expect(counter.running).toEqual(true);
      expect(setIntervalSpy.calls.mostRecent().args[1]).toEqual(1000);

      counter = countdownService.create(12000, 'someName', 2);
      countdownService.start('someName');
      expect(counter.running).toEqual(true);
      expect(setIntervalSpy.calls.mostRecent().args[1]).toEqual(1);
    });

    it('shall broadcast an event on counter exhaustion', function () {
      var counter = countdownService.create(5000, 'anotherName');
      now = 0;
      countdownService.start('anotherName');
      now = 6000;
      tickFunction('anotherName');
      $rootScope.$broadcast('coutdownService.alarm', 'anotherName');
    });
  });
});
