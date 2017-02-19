var express = require('express');
var router = express.Router();
var pool = require('../lib/db_pool');
 
var positionAction = function(response, client, done, user_id) {
    client.query(
//        "SELECT user_id as id, latitude as lat, longitude as lon, route as rt, update_time as ts FROM user_location WHERE user_id=$1",
        "SELECT user_id as id, latitude as lat, longitude as lon, update_time as ts FROM user_location WHERE user_id=$1 ORDER BY ts DESC limit 1",
        [user_id],
        function(err, result) {
            done();
            if (err) {
                console.log(err);
                response.status(500).json([]);
            } else {
                response.status(200).json(result.rows[0]);
            }
        }
    );
};

router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    
    pool.connect(function(err, client, done) {
        positionAction(response, client, done, user_id);
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    
    pool.connect(function(err, client, done) {
        positionAction(response, client, done, user_id);
    });
});
 
module.exports = router;
