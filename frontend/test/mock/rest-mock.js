module.exports = function () {
  return {
    map: {
      PUT: {
        '/log': {
          body: '',
          responseCode: 200,
          header: { 'Content-Type': 'application/json' },
        },
      },
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
