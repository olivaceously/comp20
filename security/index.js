//var cool = require('cool-ascii-faces');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();

var mongoUri = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || "mongodb://localhost:27017/test";
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(error, databaseConnection) {
    db = databaseConnection;
    app.listen(process.env.PORT || 5000);
});

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/', function(request, response) {
    response.set('Content-Type', 'text/html');
    var index = '<!DOCTYPE html><html><head><title>Checkins</title><link type="text/css" rel="stylesheet" href="/stylesheets/style.css"/></head><body><h1>Where have people checked in?</h1>';
    db.collection('people').find().toArray().then(function(doc) {
        doc.sort(function(a, b) {
            if (a.created_at < b.created_at) {
                return 1;
            } else {
                return -1;
            }
        });
        doc.forEach(function(entry) {
            index += '<p>' + entry.login + ' checked in at ' + entry.lng + ' and ' + entry.lat + ' at ' + entry.created_at + '</p>';
        });
        index += '</body></html>';
        response.statusCode = 200;
        response.send(index);
    });
});

// app.get('/cool', function(request, response) {
//     response.send(cool());
// });

app.get('/lab8', function(request, response) {
    response.sendFile(path.join(__dirname, './public/lab8.html'));
});


app.post('/sendLocation', function(request, response) {
    // set 2dsphere indexing, establish headers, check params
    db.collection('landmarks').createIndex({ geometry: "2dsphere" });
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST');
    response.setHeader('Content-Type', 'application/json');
    if (!request.body.login || !request.body.lat || !request.body.lng) {
        response.statusCode = 200;
        response.json({ error: "Whoops, something is wrong with your data!" });
        response.end();
    }
    // create new instance to add
    var toadd = {
        login: request.body.login,
        lat: Number(request.body.lat),
        lng: Number(request.body.lng),
        created_at: (new Date(Date.now())).toISOString()
    };
    // insert login into database
    db.collection('people').insert(toadd, function(error, saved) {
        if (error) {
            response.statusCode = 500;
            response.json({ error: "Whoops, something is wrong with your data!" });
            response.end();
            return;
        }

        db.collection('people').find().toArray().then(function(people) {
            db.collection('landmarks').find({
                geometry: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: [toadd.lng, toadd.lat]
                        },
                        $maxDistance: 1610
                    }
                }
            }).toArray().then(function(landmarks) {
                response.statusCode = 200;
                response.json({
                    people: people,
                    landmarks: landmarks
                });
                response.end();
            }, function(reason) {
                response.statusCode = 500;
                response.end();
            });
        });
    });
});

app.get(['/checkins.json', '/latest.json'], function(request, response) {
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET');
    response.setHeader('Content-Type', 'application/json');
    response.statusCode = 200;
    db.collection('people').find({ login: request.query.login }).toArray().then(function(checkins) {
        response.json(checkins);
        response.end();
    });
});

