'use strict'

const fs = require("fs");
const config = require("config");
const uuid = require("uuid");
const mongodb = require("mogodb");
const MongoClient = mongodb.MongoClient;
const GridFSBucket = mongodb.GridFSBucket;

const FILES_COLLECTION = 'fs.files';
const BUCKET_NAME = 'fs';


const connectionString = config.databases.contentDB.protocol + '://' +
	config.databases.contentDB.host.map(h => h + ':' + config.databases.contentDB.port).join(',') +
	'/' + config.databases.contentDB.database +
	(config.databases.contentDB.replicaSet.length > 0 ? '?replicaSet=' + config.databases.contentDB.replicaSet : '');

    class ContentDBClient {
        constructor(){
            this.db = null
        }
        connect(){
            return new Promise((resolve,reject) => {
              MongoClient.connect(connectionString)
                .then(db => {
                    this.db = db
                    console.log("MongoDB Connected")
                    resolve(true)
                })  
                .catch(err => {
                    console.log('Error connecting to ChatDB', err);
                    reject(err)
                })

            });
        }

    }


