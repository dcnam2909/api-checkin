const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const errorHandle = require('./app/middlewares/errorHandle');
const route = require('./app/routes/route');
const db = require('./app/config/db')
//Middleware global
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Route
app.use('/api', route);
app.use(errorHandle);
app.use(cors);

//Database connect
// db();
const connectionString = process.env.DB_CONNECT;
db(connectionString);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Listening at ${PORT}...`);
});
