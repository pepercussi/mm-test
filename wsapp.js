var express = require('express');
var path = require('path');
const cors = require('cors');
var wsApp = express();

wsApp.use(cors());
wsApp.use(express.json());
wsApp.use(express.static(path.join(__dirname, "./public")));

module.exports = wsApp;