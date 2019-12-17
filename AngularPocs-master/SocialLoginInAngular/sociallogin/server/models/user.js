const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: String,
    name: String,
    email: String
});

module.exports = mongoose.model('user', userSchema);