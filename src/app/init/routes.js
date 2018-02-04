'use strict';
var content = require('../routes/content');

function routesConfig(app) {

	app.all('*', (req, res, next) => {
		if (req.method === 'GET' || req.method === 'POST' || req.method === 'DELETE') {
			next();
		} else {
			res.status(405).send('NOT OK');
		}
	});

	app.use('/content/', content);
}

module.exports = routesConfig;