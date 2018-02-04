'use strict';

const express = require('express');
const redisStore = require('../client/RedisStore');
const contentStore = require('../client/contentDBClient.js');
const config = require('config');
const multer = require('multer');
const upload = multer({ dest: config.destination});
const fileValidator = require('../lib/fileValidator');
const logger = require('../lib/logger');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/healthcheck', (req, res) => {
	Promise.all([
		contentStore.ping(),
		redisStore.ping()
	])
	.then((result) => {
		res.status(200).send('OK');
	})
	.catch((error) => {
		const msg = 'Service Unavailable - code 503-2';
		logger.debug('Healthcheck fatal error', error);
		res.status(503).send(msg);
	});
});

/* GET users files listing */
router.route('/list/:personID/:type')
	.get((req, res, next) => {
		if (typeof req.params.type === 'undefined') {
			logger.debug('ERROR', 'File type is not defined');
			next({message: 'Access Forbidden', status: 403});
		} else {
			contentStore.getListOfFilesByTypeAndOwnerID(req, res);
		}
	});

router.route('/:name')
	/* GET file by name */
	.get((req, res, next) => {
		res.setHeader('Cache-Control', 'private, max-age=86400');
		contentStore.downloadFile(req.params.name, req, res);
	})
	/* DELETE file by name */
	.delete((req, res, next) => {
		contentStore.deleteFile(req.params.name, req, res);
	});
	
router.route('/upload')
	.post(upload.single('file'), (req, res, next) => {
		
		
		if (typeof req.body.type === 'undefined') {
			logger.debug('ERROR', 'File type is not defined');
			next({message: 'Access Forbidden', status: 403});
		} else {
			fileValidator.validate(req.file, req.body.type)
				.then((validationResult) => {
					logger.debug('DEBUG', 'validationResult', validationResult);
					contentStore.uploadFile(req, res);
				})
				.catch(error => {
					logger.debug('ERROR', error.message, error);
					next({message: 'Error uploading file', status: 503});
				});
		}
	});



module.exports = router;
