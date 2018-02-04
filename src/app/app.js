'use strict';

const bodyParser = require('body-parser');
const config = require('config');
const express = require('express');
const routeConfig = require('./init/routes');
const sessionConfig = require('./init/session');
const contentStore = require('./client/contentDBClient');
const redisStore = require('./client/RedisStore');
const logger = require('./lib/logger');

const app = express();
const port = config.port;
app.set('trust proxy',1);
app.set('x-powered-by',false);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

sessionConfig(app);
routeConfig(app);

app.use((err,req,res,next) => {
    let status = err.status || null;
    let msg = err.message || '';
    if (!status || !msg){
        logger.debug(`Uncaught exception - message: ${msg}, stack: ${err.stack} `);
        status = 500;
        msg = 'Internal Server Error';
    }
    res.status(status).json({error: {message: msg}});
});

contentStore.connect()
      .then((connectRes) => {
          return Promise.all([
              contentStore.ping(),
              redisStore.ping()

          ]);
      })
      .then((pingRes) => {
        logger.info('Appication Connected port',port);
        app.listen(port);
       
      })
      .catch((error) => {
        
          process.exitCode = 1;
      });


      module.export = app;