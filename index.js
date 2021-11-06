const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const path = require('path');
const errorHandle = require('./app/middlewares/errorHandle');
const route = require('./app/routes/route');
const db = require('./app/config/db');
//Middleware global
app.use(
	cors({
		origin: '*',
		methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
		preflightContinue: false,
		optionsSuccessStatus: 204,
	}),
);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Route
app.use('/api', route);
app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.use(errorHandle);

//Database connect
// db();
const connectionString = process.env.DB_CONNECT;
db(connectionString);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Listening at ${PORT}...`);
});
