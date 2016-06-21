// TODO: Get rid of this!!
/* eslint max-len: 0 */

'use strict';
var readline = require('readline');

function initReadline() {
  return readline.createInterface({
    input: process.stdin,
  });
}

// This function is called on websocket connection
module.exports = exports = function (request) {
  var wsconnection = request.accept(null, request.origin);

  // TODO: read that from a file!
  wsconnection.send('{ key: "value" }');

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

  function prompt() {
    const rl = initReadline();
    rl.question('JSON> ', function (json) {
      try {
        // Check we enter valid JSON
        JSON.parse(json);
        // Send the message
        wsconnection.send(json);
      } catch (e) {
        console.log(e);
      }
      prompt();
    });
  }

  prompt();
};
