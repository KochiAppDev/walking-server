var express = require('express');
var router = express.Router();
var pg = require('pg');
 
var positionAction = function(response, client, user_id) {
    client.query(
        "SELECT user_id as id, latitude as lat, longitude as lon, route as rt, update_time as ts FROM user_location WHERE user_id=$1",
        [user_id],
        function(err, result) {
            if (err) {
                console.log(err);
                response.status(500).json([]);
            } else {
                response.status(200).json(result.rows[0]);
            }
            client.end();
        }
    );
};

router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        positionAction(response, client, user_id);
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        positionAction(response, client, user_id);
    });
});
 
module.exports = router;