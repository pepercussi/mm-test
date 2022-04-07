var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
var restRouter = require('./routes/rest');
const storage = require('node-persist');

var app = express();
var wsApp = express();

//CORS Setup
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Authorization");
  next();
});


//Create and set WS Server
const serverWS = require('http').Server(wsApp);
const WebSocketServer = require("websocket").server;

const wsServer = new WebSocketServer({
  httpServer: serverWS,
  autoAcceptConnections: false
});

//Init storage
const storageOptions = {
  dir: './storage',
  stringify: JSON.stringify,
  parse: JSON.parse,
  encoding: 'utf8',

}


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var wsPort = process.env.PORT_WS || '3030';
wsApp.set("port", wsPort);
wsApp.use(cors());
wsApp.use(express.json());
wsApp.use(express.static(path.join(__dirname, "./public")));

// Here we get the web socket message sended by the client
// We store it and send an answer back
wsServer.on("request", async (request) =>{
  await storage.init( storageOptions );
  const connection = request.accept(null, request.origin);
  connection.on("message", async (message) => {
    var objMessage = JSON.parse(message.utf8Data);
    var key = Object.keys(objMessage);
    var value = Object.values(objMessage);
    await storage.setItem(key[0], value[0]);
    connection.sendUTF("Received: Key -> " + key[0] + " | Value -> " + value[0]);
  });
  connection.on("close", (reasonCode, description) => {
      console.log("Client disconnected");
  });
});


// Staarting the WS server in his current port
serverWS.listen(wsApp.get('port'), () =>{
  console.log('Websocket Server listening in port: ' + wsApp.get('port'));
})

app.use('/rest', restRouter);

module.exports = app;
