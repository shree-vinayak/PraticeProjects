const express = require('express');
const bodyParser = require('body-parser');

const product = require('./routes/product.route'); // Imports routes for the products
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//initialize our express app


app.use('/products', product);

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb+srv://ankit:ankit@cluster0-5e9wi.mongodb.net/productsapp?retryWrites=true&w=majority';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


let port = 1234;

app.listen(port, () => {
    console.log('Server is up and running on port :' + port);
});
