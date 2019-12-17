var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');

var api = require('./server/routes/api');

var app = express();
app.use(express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/api', api);
app.get('*', (request, response) => {
    response.sendFile('/Data/Ankit_work1/Node Example/project/todos/dist/todos/index.html');
});

app.listen(3000, function () {
    console.log('server running on localhost: 3000');
});