#!/usr/bin/env node

let app = require('../app');

let debug = require('debug')('mm-test:server');
let http = require('http');

/**
 * Get port from environment and store in Express.
 */

let port = (process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

let server = http.createServer(app);


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () =>{
  console.log('API Rest Server listening in port: ' + port);
});
server.on('error', onError);
server.on('listening', onListening);


/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
