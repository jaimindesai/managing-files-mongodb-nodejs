const pkg = "../package.json"
module.export = {
    name: pkg.name,
	version: pkg.version,
	port: process.env.PORT || 3000,
	databases: {
		edis: {
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
	destination: 'uploads/'
}