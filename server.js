// const env = require('dotenv').config({ path: `${__dirname}/.env` });
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser')

const errorHandle = require('./app/middlewares/errorHandle');
const route = require('./app/routes/route');

const app = express();

app.use(express.json())
app.use(express.static(`${__dirname}/public`));
app.use(morgan('dev'));

//Route & Middleware
app.use('/api',route);
app.use(errorHandle);

//Database connect
// db();
const db = require('./app/config/db')();


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Listening at ${PORT}...`);
});
