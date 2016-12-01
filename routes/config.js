var express = require('express');
var router = express.Router();
var pg = require('pg');
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    var user_name = request.body.nm;
    var icon = request.body.ic;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "UPDATE user_info SET user_name=$1, icon=$2, update_time=now() WHERE user_id=$3",
            [user_name, icon, user_id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json({ "result": -1 });
                } else {
                    response.json({ "result": 1 });
                }
                client.end();
            }
        );
    });
});
 
module.exports = router;