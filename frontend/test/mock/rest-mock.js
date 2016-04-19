module.exports = function () {
  return {
    map: {
      POST: {
        '/some/post/request': {
          body: '{ "key" : "value" }',
          responseCode: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      },
      GET: {
        '/some/get/request': {
          body: '{ "key" : "value" }',
          responseCode: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      },
    },
  };
};
