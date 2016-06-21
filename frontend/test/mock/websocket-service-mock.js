/**
 * This websocketService mock is used by controllers' unit tests.
 */
define('mock/websocket-service-mock', function () {
  var webSocketService = {};
  /**
   * This variable will be returned by getModel and can be set to an arbitrary
   * value by the tests.
   */
  webSocketService.modelMock = {};

  /**
   ** Mock functions.
   **
   */

  /**
   * Mock the getModel function.
   * @returns the modelMock variable which can be set to an arbitrary value.
   */
  webSocketService.getModel = jasmine.createSpy('getModel').and.callFake(function () {
    return webSocketService.modelMock;
  });

  /**
   ** Helper functions.
   **
   */

  webSocketService.reinit = function () {
    webSocketService.getModel.calls.reset();
    webSocketService.modelMock = {};
    webSocketService.modelSubscriptions = [];
  };

  return webSocketService;
});
