const config = require('config');
const expressSession = require('express-session');
const redisStore = require('../client/RedisStore').getSessionStore();
const passport = require('passport');
const logger = require('../lib/logger');

function sessionConfig(app){
    console.info(`Initializing Express session with secret ${config.sessionSecret}`);
    app.use(expressSession({
		name: config.cookieMobileName,
		cookie: {
			secure: true,
			domain: config.cookieDomain
		},
		resave: false,
		saveUninitialized: false,
		secret: config.sessionSecret,
		store: redisStore,
		unset: 'destroy'
	}));

	app.use(passport.initialize());
  app.use(passport.session());
}

passport.serializeUser(function(user, done) {
	done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
	  done(err, user);
	});
  });


module.exports = sessionConfig;