'use strict';

// This function is called on websocket connection
module.exports = exports = function (request) {
  var wsconnection = request.accept(null, request.origin);

  console.log('client connected: ', request.origin);

  // We send an initial message
  wsconnection.send(JSON.stringify({
    key: 'value',
  }));

  // Function called on message receptions
  wsconnection.on('message', function (message) {
    if (message.type === 'utf8') {
      var object = JSON.parse(message.utf8Data);

      console.log('received:', object);
    }
  });

  // Function called on socket close
  wsconnection.on('close', function (connection) {
    console.log('connection closed');
  });
};
