var express = require('express');
var router = express.Router();
var pg = require('pg');
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        client.query(
            "SELECT * FROM message WHERE message_from = $1 OR message_to = $1 OR (message_to = -1 AND (SELECT group_id FROM user_info WHERE user_id = $1) = (SELECT group_id FROM user_info WHERE user_id = message_from)) ORDER BY create_time",
            [user_id],
            function(err, result) {
                if (err) {
                    console.log(err);
                    response.json([]);
                } else {
                    response.json(result.rows);
                }
                client.end();
            }
        );
    });
});
 
module.exports = router;