/* eslint max-len: 0 */

'use strict';

module.exports = function (grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);
  // These got to be loaded manually
  grunt.registerTask('doc', ['jsdoc']);
  grunt.loadNpmTasks('gruntify-eslint');

  // Configurable paths
  var config = {
    app: 'app',
    dist: 'dist',
    test: 'test',
    tmp: '.tmp',
    package: '../backend/webapp',
    node_modules: 'node_modules',
    connectPort: 9000,
    livereloadPort: 35729,
    websocketMockPort: 8888,
  };

  // Define the configuration for all tasks
  grunt.initConfig({
    // Project configuration
    config: config,

    // Clean the output folder. The internal one used for testing (dist) and
    // the package pushed to the backend (package)
    clean: {
      files: {
        options: {
          force: true, // to delete package in backend
        },
        src: [
          '<%= config.dist %>',
          '<%= config.package %>',
          '<%= config.tmp %>',
        ],
      },
    },
    // Will execute the linter tools on the file mentioned.
    eslint: {
      src: [
        'gruntfile.js',
        '<%= config.app %>',
        '<%= config.test %>/**/*.js',
      ],
      options: {
        config: '.eslintrc',
      },
    },
    // Parse the html files provided in src and inject path to bower components
    wiredep: {
      task: {
        src: ['<%= config.app %>/index.html'],
      },
      // This target is used to inject javascript bower components inside the
      // karma configuration file.
      test: {
        devDependencies: true,
        src: '<%= karma.unit.configFile %>',
        exclude: ['source-map'],
        ignorePath: /\.\.\/\.\.\//,
        fileTypes: {
          js: {
            block: /(([\s\t]*)\/{2}\s*?bower:\s*?(\S*))(\n|\r|.)*?(\/{2}\s*endbower)/gi,
            detect: {
              js: /'(.*\.js)'/gi,
            },
            replace: {
              js: '\'{{filePath}}\',',
            },
          },
        },
      },
    },
    // Minify HTML to reduce their sice. Not applied for testing.
    // Generate the html output in config.dist
    htmlmin: {
      package: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true,
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: ['index.html'],
          dest: '<%= config.dist %>',
        }, {
          expand: true,
          flatten: true,
          cwd: '<%= config.app %>',
          src: [
            'templates/**/*.html',
            'js/directives/**/*.html',
          ],
          dest: '<%= config.dist %>/templates',
        }],
      },
    },
    // Compress images to quicken load times.
    // Compression takes times so we apply a smaller one for dist.
    // Generate compressed images to config.dist.
    imagemin: {
      dist: {
        options: {
          optimizationLevel: 1,
        },
      },
      package: {
        options: {
          optimizationLevel: 3,
        },
      },
      files: [{
        expand: true,
        cwd: '<%= config.app %>/resources/img',
        src: '{,*/}*.{png,jpg,jpeg,gif}',
        dest: '<%= config.dist %>/resources/img',
      }],
    },
    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    // Produce its output to <%= config.tmp %>/ngAnnotate/js
    ngAnnotate: {
      all: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: '**/*.js',
          dest: '<%= config.tmp %>/ngAnnotate/',
        }],
      },
    },
    // Will concatenate the javascript and wrap it around a AMD loader for the
    // browser called Almond. This wrapper is just a piece of code that
    // implements the define and require global functions.
    // For the dist target, no uglifying is done and sourceMap are generated.
    // Input files are taken from ngAnnotate tmp directory.
    // Output file is generate in config.dist
    requirejs: { // includes uglifyjs
      options: {
        baseUrl: '<%= config.tmp %>/ngAnnotate/js',
        include: 'main', // Main script to load
        name: '../../../<%= config.node_modules %>/almond/almond', // Using almond for production
        out: '<%= config.dist %>/js/app.js',
      },
      dist: {
        options: {
          optimize: 'none', // disable uglify for debugging purposes
          generateSourceMaps: true,
        },
      },
      package: {
        options: {
          optimize: 'uglify', // this is the default value
        },
      },
    },
    // Concatenate bower components to one file to speed up loading.
    bower_concat: {
      all: {
        dest: {
          js: '<%= config.dist %>/js/lib/vendor.js',
          css: '<%= config.dist %>/resources/css/lib/vendor.css',
        },
        // Exclude stacktrace.js, which behaves badly and include files that are
        // not ready to be loaded in the browser (source-map.js which is using
        // the 'exports' global variable)
        exclude: [
          'source-map',
        ],
        // Bootstrap does not respect the bower standards, thus the need to
        // specify to bower_concat where the files are located.
        mainFiles: {
          bootstrap: [
            'dist/css/bootstrap.min.css',
            'dist/js/bootstrap.min.js',
          ],
          'stacktrace-js': [
            'dist/stacktrace-with-promises-and-json-polyfills.min.js',
            'dist/stacktrace-with-promises-and-json-polyfills.min.js.map',
          ],
        },
      },
    },
    // Takes vendor.js generated by bower_concat and compress it.
    uglify: {
      files: {
        '<%= config.dist %>/js/lib/vendor.min.js': [
          '<%= config.dist %>/js/lib/vendor.js',
        ],
      },
      dist: {
        options: {
          sourceMap: true,
          sourceMapName: '<%= config.dist %>/js/lib/vendor.js.map',
          screwIE8: true,
        },
        files: '<%= uglify.files %>',
      },
      package: {
        options: {
          sourceMap: false,
          screwIE8: true,
        },
        files: '<%= uglify.files %>',
      },
    },
    // Compile .less files to .css into the tmp directory
    less: {
      dist: {
        files: {
          '<%= config.tmp %>/resources/css/main.css': '<%= config.app %>/resources/css/main.less',
        },
      },
    },
    // Concatenate all css (either generated and placed in the tmp directory
    // or the manually written one from app/resources) into one css file placed
    // in the dist folder
    concat: {
      css: {
        src: [
          '<%= config.app %>/resources/css/*.css',
          '<%= config.tmp %>/resources/css/*.css',
        ],
        dest: '<%= config.tmp %>/resources/css/styles.css',
        sourceMap: true,
      },
    },
    // Minify and concatenate CSS files.
    // Generate minified css files to config.dist.
    cssmin: {
      files: [{ // project css files
        expand: true,
        cwd: '<%= config.tmp %>/resources/css',
        src: ['styles.css'],
        dest: '<%= config.dist %>/resources/css',
        ext: '.min.css',
      }, { // vendor css files
        expand: true,
        cwd: '<%= config.dist %>/resources/css/lib',
        src: ['vendor.css'],
        dest: '<%= config.dist %>/resources/css/lib',
        ext: '.min.css',
      }],
      dist: {
        options: {
          sourceMap: true,
        },
        files: '<%= cssmin.files %>',
      },
      package: {
        options: {
          sourceMap: false,
        },
        files: '<%= cssmin.files %>',
      },
    },
    // Copy the remaining files in dist
    // Special action for package which copied the whole dist folder to the
    // backend.
    copy: {
      html: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: ['index.html', 'favicon.ico'],
          dest: '<%= config.dist %>',
        }, {
          expand: true,
          cwd: '<%= config.app %>',
          src: ['templates/**/*.html'],
          dest: '<%= config.dist %>',
        }, {
          expand: true,
          flatten: true,
          cwd: '<%= config.app %>',
          src: ['js/directives/**/*.html'],
          dest: '<%= config.dist %>/templates',
        }],
      },
      resources: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>',
          src: ['resources/locales/*.json', 'favicon.ico'],
          dest: '<%= config.dist %>',
        }],
      },
      // Manually copy bootstrap fonts referenced in vendor.css
      font: {
        files: [{
          expand: true,
          flatten: true,
          src: ['./bower_components/bootstrap/dist/fonts/**/*.ttf'],
          dest: '<%= config.dist %>/resources/css/fonts/',
        }],
      },
      fakeuglify: {
        files: [{
          src: '<%= config.dist %>/js/lib/vendor.js',
          dest: '<%= config.dist %>/js/lib/vendor.min.js',
        }],
      },
      package: {
        files: [{
          expand: true,
          cwd: '<%= config.dist %>',
          src: ['**/*'],
          dest: '<%= config.package %>',
        }],
      },
    },

    /*
     * Here start the part of the configuration used for tests
     */

    // Create a webserver to statically serve the page for testing purposes.
    // Use watch/livereload to automatically compile and reload on changes.
    connect: {
      options: {
        port: '<%= config.connectPort %>',
        // Do not automatically open a browser
        open: false,
        // Log HTTP requests
        debug: true,
        livereload: '<%= config.livereloadPort %>',
        // Change this to 'localhost' to prevent access to the server from outside
        hostname: '0.0.0.0',
      },
      livereload: {
        options: {
          middleware: function (connect) {
            var debugMockRequests = require('./test/mock/rest-mock');
            console.log(debugMockRequests());
            var mockRequests = require('mock-rest-request');
            return [
              mockRequests(debugMockRequests()),
              connect.static('dist'),
            ];
          },
        },
      },
    },
    // Watch changes in files and performs tasks accordingly.
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall'],
      },
      js: {
        files: ['<%= config.app %>/js/**/*.js'],
        tasks: ['dist'],
        options: {
          livereload: true,
        },
      },
      html: {
        files: ['<%= config.app %>/**/*.html'],
        tasks: ['dist'],
        options: {
          livereload: true,
        },
      },
      jstest: {
        files: ['test/**/*.js'],
        tasks: ['test:watch'],
      },
      gruntfile: {
        files: ['gruntfile.js'],
      },
      styles: {
        files: ['<%= config.app %>/resources/css/**/*.css'],
        tasks: ['less:dist', 'concat:css', 'cssmin:dist'],
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>',
        },
        files: [
          '<%= config.app %>/index.html',
          '<%= config.app %>/templates/**/*.html',
          '<%= config.app %>/templates/**/*.css',
          '<%= config.app %>/templates/**/*',
        ],
      },
    },
    // Define a mock websocket server used for testing purposes.
    // It is only used for informal test performed in development.
    // Warning: No websocket shall be used when unit testing !
    websocket: {
      options: {
        port: '<%= config.websocketMockPort %>',
        handler: 'test/mock/websocket-mock.js',
      },
      target: {},
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/unit/karma.conf.js',
        singleRun: true,
      },
    },

    // Generate documentation
    jsdoc: {
      dist: {
        src: ['app/**/*.js', 'test/**/*.js'],
        options: {
          destination: 'doc',
        },
      },
    },
  });

  // Create the dist folder, with a minimum of minification and with maps
  // generated for easier debugging.
  grunt.registerTask('dist', function (target) {
    grunt.task.run([
      'clean',
      'eslint',
      'wiredep',
      'imagemin:dist',
      'copy:html', // No minification of HTML for testing
      'copy:resources',
      'ngAnnotate',
      'requirejs:dist',
      'bower_concat',
      'copy:font',
      'less:dist',
      'concat:css',
      'cssmin:dist',
      'copy:fakeuglify', // To speed up the process. Uglify. is. slow.
    ]);
  });

  // Create a web and websocket server for statically serving the frontend for
  // testing purpose
  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'dist',
      'connect:livereload',
      'websocket',
      'watch',
    ]);
  });

  // Package the solution for production. Maximum manification, uglification and
  // compression applied.
  // The package is first prepared in the dist folder and then copied to the
  // backend
  grunt.registerTask('package', function (target) {
    grunt.task.run([
      'clean',
      'eslint',
      'wiredep',
      'imagemin:package',
      'htmlmin',
      'copy:resources',
      'ngAnnotate',
      'requirejs:package',
      'bower_concat',
      'copy:font',
      'uglify:package',
      'less:dist',
      'concat:css',
      'cssmin:package',
      'copy:package', // Copy package to the backend
    ]);
  });

  // Execute the karma test
  grunt.registerTask('test', [
    'dist',
    'wiredep:test', // Inject bower dependencies in karma configuration file.
    'karma',
  ]);

  // Test and package (default tasks)
  grunt.registerTask('default', function (target) {
    grunt.task.run([
      'test',
      'package',
    ]);
  });

  // Generate the docs
  grunt.registerTask('doc', function (target) {
    grunt.task.run([
      'jsdoc',
    ]);
  });

  // Maven related tasks
  grunt.registerTask('compile', function (target) {
    grunt.task.run([
      'package',
    ]);
  });

  grunt.registerTask('test-only', function (target) {
    grunt.task.run([
      'test',
    ]);
  });
};
