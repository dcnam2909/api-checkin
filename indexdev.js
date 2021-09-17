const env = require('dotenv').config({ path: `${__dirname}/.env` });
const morgan = require('morgan');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(morgan('dev'));
const errorHandle = require('./app/middlewares/errorHandle');
const route = require('./app/routes/route');

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//Route & Middleware
app.use('/api', route);
app.use(errorHandle);

//Database connect
// db();
const db = require('./app/config/db')();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Listening at ${PORT}...`);
});
