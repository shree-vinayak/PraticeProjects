const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const videoSchema = new Schema({
    title: String,
    url: String,
    description: String
    id: Num
});

module.exports = mongoose.model('video', videoSchema, 'videos');