'use strict';

var express = require('express');
var controller = require('./thing.controller');

var router = express.Router();

router.get('/', controller.getAllThings);
router.get('/:thingId', controller.getThing);
router.post('/update', controller.update);
router.post('/add', controller.addThing);
router.post('/remove', controller.removeThing);


module.exports = router;
