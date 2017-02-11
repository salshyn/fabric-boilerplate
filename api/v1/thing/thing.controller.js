'use strict';

const Thing = require('./thing.model');
const BlockchainService = require('../../../services/blockchainSrvc.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const pg = require('pg');



/*
    Retrieve list of all things

    METHOD: GET
    URL : /api/v1/thing
    Response:
        [{'thing'}, {'thing'}]
*/
exports.getAllThings = function(req, res) {
    console.log("-- Query all things --");

    const functionName = "get_all_things";
    const args = [req.userId];

    BlockchainService.query(functionName,args,req.userId).then(function(things){
        if (!things) {
            res.json([]);
        } else {
            console.log("Retrieved things from the blockchain: # " + things.length);
            res.json(things)
        }
    }).catch(function(err){
        console.log("Error", err);
        res.sendStatus(500);
    });
};

/*
    Retrieve thing object

    METHOD: GET
    URL: /api/v1/thing/:thingId
    Response:
        { thing }
*/
exports.getThing = function(req, res) {
    console.log("-- Query thing --")

    const functionName = "get_thing";
    const args = [req.params.thingId];

    BlockchainService.query(functionName,args,req.userId).then(function(thing){
        if (!thing) {
            res.json([]);
        } else {
            console.log("Retrieved thing from the blockchain");
            res.json(thing)
        }
    }).catch(function(err){
        console.log("Error", err);
        res.sendStatus(500);
    });
};

/*
    Add thing object

    METHOD: POST
    URL: /api/v1/thing/add
    Response:
        {  }
*/
exports.addThing = function (req, res) {
    console.log("-- Adding thing --");

    const functionName = "add_thing";
    const args = [req.body.id, JSON.stringify(req.body), req.userId];
    console.log(args);

    BlockchainService.invoke(functionName, args, req.userId)
        .then(function (thing) {
            res.sendStatus(200);
        }).catch(function (err) {
            console.log("Error", err);
            res.sendStatus(500);
        });
};

/*
    Remove thing object

    METHOD: POST
    URL: /api/v1/thing/remove
    Response:
        {  }
*/
exports.removeThing = function (req, res) {
    console.log("-- Removing thing -- in 'thing.controller.js'");

    const functionName = "remove_thing";
    const args = [req.body.id, JSON.stringify(req.body), req.userId];
    console.log(args);

    BlockchainService.invoke(functionName, args, req.userId)
        .then(function (thing) {
            res.sendStatus(200);
        }).catch(function (err) {
            console.log("Error", err);
            res.sendStatus(500);
        });
};

/*
    Update thing object

    METHOD: GET
    URL: /api/v1/thing/update
    Response:
        {  }
*/
exports.update = function (req, res) {
    console.log("-- Updating things -- in 'thing.controller.js'");

    const functionName = "update_things";

    var config = {
      user: 'pollenadmin', //env var: PGUSER
      database: 'c2fo', //env var: PGDATABASE
      password: 'su!4you11aaAAaa', //env var: PGPASSWORD
      host: 'fss-db.c2fo.com', // Server hosting the postgres database
      port: 5432, //env var: PGPORT
      max: 10, // max number of clients in the pool
      idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
    };
    var pool = new pg.Pool(config);
    pool.connect(function(err, client, done) {
        if(err) {
            return console.error('error fetching client from pool', err);
        }
        client.query('SELECT id, voucher_id FROM invoice LIMIT 1000', function(err, result) {
          //call `done()` to release the client back to the pool
          for (var item in result.rows) {
              const test = '{"id":"' + result.rows[item].id + '","description":"' + result.rows[item].voucher_id + '"}';
              const args = [result.rows[item].id, test, req.userId];
              BlockchainService.invoke(functionName, args, req.userId)
                  .then(function (thing) {
                        res.sendStatus(200);
                  }).catch(function (err) {
                  console.log("Error", err);
                      res.sendStatus(500);
                  });
          }
          done();

          if(err) {
            return console.error('error running query', err);
          }
        });
    });

    pool.on('error', function (err, client) {
      console.error('idle client error', err.message, err.stack)
    })
};
