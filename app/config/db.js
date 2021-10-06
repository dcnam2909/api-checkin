const mongoose = require('mongoose');

module.exports = async (connectionString) => {
	try {
		await mongoose.connect(`${connectionString}`);
		console.log('Connect to database successfully!');
	} catch (error) {
		console.error(error);
		console.log('Fail to connect database!');
		process.exit();
	}
};
