var express = require('express');
var router = express.Router();
var pg = require('pg');
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    var route = request.body.rt;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "UPDATE user_location SET route=$1 WHERE user_id=$2",
            [route, user_id],
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