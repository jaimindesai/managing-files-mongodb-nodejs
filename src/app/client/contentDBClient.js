'use strict';

const fs = require('fs');
const config = require('config');
const uuid = require('uuid');
const mongodb = require('mongodb');
const logger = require('../lib/logger');
const MongoClient = mongodb.MongoClient;
const GridFSBucket = mongodb.GridFSBucket;
const metaData = require('../lib/metaData');
const FILES_COLLECTION = 'fs.files';
const BUCKET_NAME = 'fs';


const connectionString = config.databases.contentDB.protocol + '://' +
	config.databases.contentDB.host.map(h => h + ':' + config.databases.contentDB.port).join(',') +
	'/' + config.databases.contentDB.database +
	(config.databases.contentDB.replicaSet.length > 0 ? '?replicaSet=' + config.databases.contentDB.replicaSet : '');

    class ContentDBClient {
        constructor(){
            this.db = null;
        }
        connect(){
            return new Promise((resolve,reject) => {
              MongoClient.connect(connectionString)
                .then(db => {
					this.db = db;
					logger.info('MongoDB Connected');
                    resolve(true);
                })  
                .catch(err => {
                    logger.debug('Error connecting to MongoDB', err);
                    reject(err);
                });

            });
        }

        uploadFile(req,res){
            let db = this.db;
            let bucket = new GridFSBucket(db,{backetName: BUCKET_NAME});
            let ext = req.file.originalname.match(/\.[^/.]+$/);
            ext = Array.isArray(ext) && ext.length > 0 ? ext[0] : '';
            let filename = uuid.v4() + ext;
            
            let metaOptions = {
                originalname: req.file.originalname,
                extension: ext,
                size: req.file.size,
                encoding: req.file.encoding
            };
            
            let metadata = metaData.buildMeta(req.user, req.body, metaOptions);
    
            let uploadStream = bucket.openUploadStream(filename, {
                metadata: metadata,
                contentType: req.file.mimetype
            });


			logger.info(`contentDBClient::uploadFile: created uploadStream for ${filename}`);

		uploadStream.on('error', error => {
			logger.debug('Error occurred during uploading file ', error);
			res.status(503).send('Error uploading file');
		});

		uploadStream.once('finish', () => {
			res.status(201).send({filename: filename});
		});

		fs.createReadStream(req.file.path)
			.on('end', () => {
				fs.unlink(req.file.path, (err) => {
					if (err) {
						logger.debug(`File ${req.file.path} failed on removal.`);
					} else {
						logger.debug(`File ${req.file.path} successfully removed.`);
					}
				});
			})
			.on('error', (error) => {
				logger.debug('ERROR',error);
				res.status(503).send('Error uploading file');
			})
			.pipe(uploadStream);
    
        }

        ping() {
            let db = this.db;
            return new Promise((resolve, reject) => {
                let dbAdmin = db.admin();
                dbAdmin.ping()
                    .then(resolve)
                    .catch(reject);
            });
        }


      
	getListOfFilesByTypeAndOwnerID (req, res) {
        logger.info('metadata.ownerID', req.params.personID, 'metadata.type', req.params.type)
		let db = this.db;
		let query = {'metadata.ownerID': req.params.personID, 'metadata.type': req.params.type};
		db.collection(FILES_COLLECTION)
			.find(query, {fields: {_id: 0, 'metadata.originalname': 1, filename: 1}})
			.toArray()
			.then((data) => {

				console.log('resulted data', data);
				let resData = data.map(d => {
					return {
						label: d.metadata.originalname,
						name: d.filename
					};
				});
				res.status(200).send(resData);
			})
			.catch((error) => {
				logger.debug('ERROR', error.message);
				res.status(500).send('Something went wrong.');
			});
    }
    

    downloadFile (fileName, req, res) {
		let db = this.db;
		db.collection(FILES_COLLECTION).findOne({filename: fileName}, {fields: {contentType: 1, metadata: 1}})
		.then(doc => {
				if (doc !== null) {
					
						if (doc.contentType) {
							res.setHeader('Content-type', doc.contentType);
						}

						let bucket = new GridFSBucket(db, {bucketName: BUCKET_NAME});
						bucket.openDownloadStreamByName(fileName)
							.pipe(res)
							.on('error', error => {
								logger.debug('Error occurred during piping file ', error);
								res.status(404).send('File not found');
							})
							.on('close', () => {
								logger.info('File downloaded');
							});
					
				} else {
					res.status(404).send('File not found');
				}
		})
		.catch(error => {
			logger.debug('ERROR', error.message);
			res.status(500).send('Something went wrong.');
		});
	}

    }

    




    module.exports = new ContentDBClient();
