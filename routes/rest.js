var express = require('express');
var router = express.Router();
const restController = require("../controllers/restController.js");

router.get('/all', restController.getAllKeys);

router.get('/', restController.getValueByKey);

router.post('/delete/all', restController.deleteAllKeys);

module.exports = router;
