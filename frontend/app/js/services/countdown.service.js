/* eslint no-use-before-define: 0 */

/**
 * @module service/countdown
 */
define('services/countdown.service', function () {
  'use strict';

  console.log('RIEN!');

  /**
   * Manage timers for angular applications
   * @params $rootScope {object} - angular $rootScope
   * @constructor
   * @alias module:service/countdown
   */
  var countdownServiceFactory = function ($rootScope) {
    /** The countdown service */
    var countdownService = {};
    /** The countdown objects */
    countdownService.countdowns = {};
    /** Some definitions */
    var eResolution = {
      SECONDS: 1,
      MILLISECONDS: 2,
    };
    /** Default options */
    var defaultOptions = {
      resolution: eResolution.SECONDS,
    };

    /**
     * @function create
     * Creates a countdown timer
     * @params {int} value - Value of the countdown timer in milliseconds
     * @params {string} [name] - Name of the countdown timer
     * @params {int} [resolution=1] - resolution of the interval caluclation in
     *                                second (1) or milliseconds (2)
     * @returns {object} countdown object. The member countdown contains is an
     * integer and contains the value of the coundown in milliseconds.
     * @access public
     */
    countdownService.create = function create(value, name, resolution) {
      // If no name provided, use a generic name
      name = name || 'noname';
      // Merge default options with provided options
      resolution = resolution || 1;
      // Configure countdown object
      countdownService.countdowns[name] = {};
      countdownService.countdowns[name].value = value;
      countdownService.countdowns[name].countdown = value;
      countdownService.countdowns[name].running = false;
      if (resolution === 2) {
        countdownService.countdowns[name].resolution = 1;
      } else {
        countdownService.countdowns[name].resolution = 1000;
      }
      return countdownService.countdowns[name];
    };

    /**
     * @function start
     * Start a countdown timer.
     * @params {string} [name] - Name of the countdown timer
     * @access public
     */
    countdownService.start = function start(name) {
      // If no name provided, use a generic name
      name = name || 'noname';
      countdownService.countdowns[name].startTime = new Date().getTime();

      var interval = setInterval(function () {
        tick(name);
      }, countdownService.countdowns[name].resolution);
      countdownService.countdowns[name].interval = interval;
      countdownService.countdowns[name].running = true;
    };

    /**
     * @function reset
     * Reset the countdown value to its original value
     * @params {string} [name] - Name of the countdown timer
     * @access public
     */
    countdownService.reset = function reset(name) {
      // If no name provided, use a generic name
      name = name || 'noname';
      countdownService.countdowns[name].countdown = countdownService.countdowns[name].value;
    };

    /**
     * @function get
     * Get the countdown timer
     * @params {string} [name] - Name of the countdown timer
     * @returns {object} - Return the countdown timer object.
     * @access public
     */
    countdownService.get = function get(name) {
      // If no name provided, use a generic name
      name = name || 'noname';
      return countdownService.countdowns[name];
    };

    /**
     * Update the countdown value of the timer depending on its start time and
     * time that has passed since its been started.
     * @access private
     */
    function tick(name) {
      var countdownObject = countdownService.countdowns[name];
      countdownObject.countdown =
        countdownObject.value - (new Date().getTime() - countdownObject.startTime);
      // Don't overrun the counter. Once less than 0, reset to 0 and stop it.
      if (countdownObject.countdown < 0) {
        // Clean up the countdown to 0
        countdownObject.countdown = 0;
        // Disable the counter
        clearInterval(countdownObject.interval);
        countdownService.countdowns[name].running = false;
        // Emit a signal
        $rootScope.$broadcast('coutdownService.alarm', name);
      }
    }

    return countdownService;
  };

  return countdownServiceFactory;
});
