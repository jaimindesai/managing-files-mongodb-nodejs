const pkg = require('../package.json');
const BASE_PROTOCOL = 'http';
const BASE_DOMAIN = 'e';
const BASE_SUBDOMAIN = 'local.deeproot.com';
const BASE_HOST = `${BASE_DOMAIN}.${BASE_SUBDOMAIN}`;
const BASE_URL = `${BASE_PROTOCOL}://${BASE_HOST}/`;

// eslint-disable-next-line no-console
console.log(`Default Config Base URL: ${BASE_URL}`);

module.exports = {
	name: pkg.name,
	version: pkg.version,
	port: process.env.PORT || 3000,
	sessionSecret: 'foo',
	cookieDomain: `.${BASE_SUBDOMAIN}`,
	cookieMobileName: 'mys.token',
	databases: {
		redis: {
			url: 'redis://127.0.0.1:6379',
			protocol: 'redis',
			host: '127.0.0.1',
			port: '6379',
			path: '',
			ttl: 604800
		},
		contentDB: {
			protocol: 'mongodb',
			host: ['127.0.0.1'],
			port: '27017',
			database: 'content',
			replicaSet: ''
		}
	},
	destination: 'uploads/',
	logDir:'logs/'
};

