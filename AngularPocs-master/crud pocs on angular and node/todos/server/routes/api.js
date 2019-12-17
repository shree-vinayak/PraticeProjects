var express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
const Video = require('../models/video');

const db = "mongodb+srv://ankit:ankit@cluster0-5e9wi.mongodb.net/test?retryWrites=true&w=majority";
mongoose.Promise = global.Promise;

mongoose.connect(db, function (err) {
    if (err) {
        console.log('error! ' + err);
    }
    else {
        console.log('connected successfully');
    }
});






router.get('/videos', function (req, res, next) {
    console.log('Get request for all videos');

    Video.find({}).exec(function (err, videos) {
        if (err) {
            console.log('Error retrieving videos');
        }
        else {
            res.json(videos);
        }
    });
});

router.get('/videos/:id', function (req, res, next) {
    console.log('Get request for a single video');
    Video.findById(req.params.id)
        .exec(function (err, video) {
            if (err) {
                console.log('Error retrieving videos');
            }
            else {
                res.json(video);
            }
        });
});



router.post('/video', function (req, res) {
    console.log('Post a video');
    var newVideo = new Video();
    newVideo.title = req.body.title;
    newVideo.url = req.body.url;
    newVideo.description = req.body.description;
    newVideo.save(function (err, insertedVideo) {
        if (err) {
            console.log('Error in saving video');
        }
        else {
            res.json(insertedVideo);
        }
    });
});
router.put('/video/:id', function (req, res) {
    console.log('put Request');
    Video.findByIdAndUpdate(req.params.id, {
        $set: { title: req.body.title, url: req.body.url, description: req.body.description }
    }, {
        new: true
    }, function (err, updatedVideo) {
        if (err) {
            res.send('Error update video');
        }
        else {
            res.json(updatedVideo);
        }
    });
});


router.delete('/video/:id', function (req, res) {
    console.log('Deleting a video');
    Video.findByIdAndRemove(req.params.id, function (err, deletedVideo) {
        if (err) {
            res.send('Error in deleting video');
        }
        else {
            res.json(deletedVideo);
        }
    });
});


module.exports = router;