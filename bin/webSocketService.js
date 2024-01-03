#!/usr/bin/env node
let storage = require('node-persist');
const Joi = require('joi');

const schema = Joi.object({
  key: Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .required(),
  value: Joi.string()
  .alphanum()
  .min(3)
  .max(30)
  .required(),
});

let wsApp = require('../wsapp');

let debug = require('debug')('mm-test:serverWS');

// Create and set the necessary vars for Web Socket Server
const serverWS = require('http').Server(wsApp);
const WebSocketServer = require("websocket").server;

const wsServer = new WebSocketServer({
  httpServer: serverWS,
  autoAcceptConnections: false
});

/**
 * Get port from environment and store in Express.
 */

let wsPort = (process.env.PORT_WS || '3030');
wsApp.set("port", wsPort);


/* 
* Here we get the web socket message sended by the client
* We store it and send an answer back 
*/
wsServer.on("request", async (request) =>{
  const connection = request.accept(null, request.origin);
  connection.on("message", async (message) => {
    // get the message
    let objMessage = JSON.parse(message.utf8Data);
    let key = Object.keys(objMessage);
    let value = Object.values(objMessage);
    // Validate the imput
    const { error, input} = await schema.validate({ key: key[0], value: value[0] });
    if(!error){
      await storage.init();
      await storage.setItem(key[0], value[0]);
      connection.sendUTF("Received: Key -> " + key[0] + " | Value -> " + value[0]);
    }else{
      connection.sendUTF("There was an error with data input (" + input + "): " + error.message);
    }
  });
  connection.on("close", (reasonCode, description) => {
      console.log("Client disconnected");
      console.log("  -- Reason Code: " + reasonCode);
      console.log("  -- Description: " + description);
  });
});



// Starting the WS server in his current port
serverWS.listen(wsPort, () =>{
  console.log('Websocket Server listening in port: ' + wsPort);
})
serverWS.on('error', onError);
serverWS.on('listening', onListening);

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
    let addr = serverWS.address();
    let bind = typeof addr === 'string'
      ? 'pipe ' + addr
      : 'port ' + addr.port;
    debug('Listening on ' + bind);
  }