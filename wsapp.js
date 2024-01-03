let express = require('express');
let path = require('path');
const cors = require('cors');
let wsApp = express();

wsApp.use(cors());
wsApp.use(express.json());
wsApp.use(express.static(path.join(__dirname, "./public")));

module.exports = wsApp;