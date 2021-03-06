/* eslint max-len: 0 */

module.exports = function (config) {
  'use strict';

  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../../',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'], // do not include requirejs here but below, in the
                             // files property, to make sure to load it at the
                             // appropriate time (after the bower components).

    // list of files / patterns to load in the browser
    files: [
      // This part is filled but by wiredep, a task configured in the gruntfile.
      // bower:js
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-translate/angular-translate.js',
      'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/oclazyload/dist/ocLazyLoad.js',
      'bower_components/hammerjs/hammer.js',
      'bower_components/ryanmullins-angular-hammer/angular.hammer.js',
      'bower_components/stackframe/stackframe.js',
      'bower_components/error-stack-parser/error-stack-parser.js',
      'bower_components/stack-generator/stack-generator.js',
      'bower_components/stacktrace-gps/dist/stacktrace-gps.js',
      'bower_components/stacktrace-js/dist/stacktrace-with-promises-and-json-polyfills.min.js',
      'bower_components/lodash/lodash.js',
      'bower_components/angular-mocks/angular-mocks.js',
      // endbower

      // Add require here, after the bower componenes, which will be loaded
			// AMD style.
      'node_modules/requirejs/require.js',
      'node_modules/karma-requirejs/lib/adapter.js',

      // Babel polyfill is used to enable ES6 features on PhantomJS
      'node_modules/babel-polyfill/dist/polyfill.js',

      // Some helper files
      'test/mock/promise-mock.js',
      'test/mock/angular-translate-mock.js',
      'test/mock/websocket-service-mock.js',

      'app/js/**/*.js',
      'test/unit/**/*.spec.js',
      'test/unit/test-main.js',

      // Templates
      'dist/**/*.html',
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'dist/**/*.html': ['ng-html2js'],
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      'app/**/*.js': ['coverage'],
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    //                  config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Which plugins to enable
    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-coverage',
    ],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity,

    // ng-html2js configuration
    ngHtml2JsPreprocessor: {
      stripPrefix: 'dist/',
    },

    // optionally, configure the reporter
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
    },
  });
};
