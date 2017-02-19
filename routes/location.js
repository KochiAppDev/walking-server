var express = require('express');
var router = express.Router();
var pool = require('../lib/db_pool');

var locationAction = function(response, client, done, user_id, lat, lon) {
    console.log("#UPDATE Location [" + lat + ":" + lon + "]");
    client.query(
        "UPDATE user_location SET latitude=$1, longitude=$2, update_time=now() WHERE user_id=$3",
//        "INSERT INTO user_location (latitude, longitude, user_id, update_time) VALUES ($1, $2, $3, now())",
        function(err, result) {
            done();
            if (err) {
                console.log(err);
                response.status(500).json({ "result": -1 });
            } else {
                client.query(
                    "INSERT INTO user_location (latitude, longitude, user_id, update_time) SELECT $1, $2, $3, now() WHERE NOT EXISTS (SELECT 1 FROM user_location WHERE id=$3);
                    [lat, lon, user_id],
                    function(err, result) {
                        done();
                        if (err) {
                            console.log(err);
                            response.status(500).json({ "result": -1 });
                        } else {
                            response.status(200).json({ "result": 1 });
                        }
                    }
                );
//                response.status(200).json({ "result": 1 });
            }
        }
    );
};

router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    var lat = request.query.lt;
    var lon = request.query.ln;
    
    pool.connect(function(err, client, done) {
        locationAction(response, client, done, user_id, lat, lon);
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    var lat = request.body.lat;
    var lon = request.body.lon;
    
    pool.connect(function(err, client, done) {
        locationAction(response, client, done, user_id, lat, lon);
    });
});
 
module.exports = router;
