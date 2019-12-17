const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
var mongoose = require("mongoose");

const api = require('./server/routes/api');

const port = 4200;
const app = express();

app.use(express.static(path.join(__dirname, 'dist/sociallogin')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use('/api', api);

app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'dist/sociallogin/index.html'));
});


app.listen(port, function () {
    console.log(`server running on localhost: ${port}`);
    console.log((path.join(__dirname, 'dist')))
    console.log(__dirname);
});


