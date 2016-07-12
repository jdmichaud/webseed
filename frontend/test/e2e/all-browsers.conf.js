exports.config = {
  framework: 'jasmine',
  specs: ['./**/*.spec.js'],
  multiCapabilities: [{
    browserName: 'chrome',
  }, {
    browserName: 'firefox',
  }],
};
