var express = require('express');
var router = express.Router();
var pg = require('pg');

var locationAction = function(response, client, user_id, lat, lon) {
    client.query(
        "UPDATE user_location SET latitude=$1, longitude=$2, update_time=now() WHERE user_id=$3",
        [lat, lon, user_id],
        function(err, result) {
            if (err) {
                console.log(err);
                response.status(500).json({ "result": -1 });
            } else {
                response.status(200).json({ "result": 1 });
            }
            client.end();
        }
    );
};

router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    var lat = request.query.lt;
    var lon = request.query.ln;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        locationAction(response, client, user_id, lat, lon);
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    var lat = request.body.lt;
    var lon = request.body.ln;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        locationAction(response, client, user_id, lat, lon);
    });
});
 
module.exports = router;