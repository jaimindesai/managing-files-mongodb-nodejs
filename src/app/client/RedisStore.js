'use strict';

const redis = require('redis');
const config = require('config');
const logger = require('../lib/logger');
const expressSession = require('express-session');
const ConnectRedis = require('connect-redis')(expressSession);
const Promise = require('bluebird');



Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

function getDbEndpoint(dbConfig) {
	logger.debug('Unable to configure Redis DB endpoint from arguments', dbConfig);
	if (!dbConfig) {
		logger.debug('Unable to configure Redis DB endpoint from arguments', dbConfig);
	}
	const protocol = dbConfig.protocol;
	const host = dbConfig.host;
	const port = dbConfig.port;
	const path = dbConfig.path;
	return `${protocol}://${host}:${port}/${path}`;
}



const dbEndpoint = getDbEndpoint(config.databases ? config.databases.redis : null);

const client = redis.createClient({ url: dbEndpoint });

/* eslint-disable camelcase */
client.on('reconnecting', ({ attempt, times_connected, total_retry_time, error }) => {
	logger.info(`Redis client reconnecting - attempt ${attempt}, timesConnected
		 ${times_connected}, totalRetryTime ${total_retry_time}`);

	if (error instanceof Error) {
		console.log(`Redis reconnect error: ${error.message}`, error);
	}
});
/* eslint-enable camelcase */

client.on('end', () => {
	logger.info('Redis client connection ended');
});

client.on('error', (err) => {
	logger.info(`Redis client error: ${err}`);
});

client.on('connect', () => {
	logger.info('Connected to Redis server');
});

client.on('ready', () => {
	logger.info('Redis server is ready');
});


function getSessionStore() {
	const storeOptions = {
		client: client
	};

	if (config.databases.redis.ttl > 0) {
		storeOptions.ttl = config.databases.redis.ttl;
	} else {
		storeOptions.disableTTL = true;
	}

	return new ConnectRedis(storeOptions);
}

function ping() {
	return new Promise((resolve, reject) => {
		client.pingAsync()
			.then(resolve)
			.catch(reject);
	});
}

module.exports = {
	getSessionStore,
	ping
};

