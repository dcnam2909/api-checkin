const mongoose = require('mongoose');

module.exports = async () => {
	try {
		const connectString = process.env.DB_CONNECT || process.env.DB_LOCAL;
		await mongoose.connect(`${connectString}`);
		console.log('Connect to database successfully!');
	} catch (error) {
		console.error(error);
		console.log('Fail to connect database!');
		process.exit();
	}
};
