var env = process.env.NODE_ENV || 'development';

// managing local config variables
if (env === 'development' || env === 'test') {
	var config = require('./config.json')[env];
	
	Object.keys(config).forEach((key) => {
		process.env[key] = config[key];
	});
}


// if (env === 'development') {
// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
// } else if (env === 'test') {
// 	process.env.PORT = 3000;
// 	process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
// }