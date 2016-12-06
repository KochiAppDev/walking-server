var express = require('express');
var router = express.Router();
var pg = require('pg');
 
var talkAction = function(response, client, user_id) {
    client.query(
        "SELECT message_id as id, message_from as from, message_type as type, (CASE message_type WHEN 1 THEN to_char(icon, '9') WHEN 2 THEN image ELSE plain END) as ms, create_time as ts FROM message WHERE message_from = $1 OR message_to = $1 OR (message_to = -1 AND (SELECT group_id FROM user_info WHERE user_id = $1) = (SELECT group_id FROM user_info WHERE user_id = message_from)) ORDER BY create_time",
        [user_id],
        function(err, result) {
            if (err) {
                console.log(err);
                response.status(500).json([]);
            } else {
                response.status(200).json(result.rows);
            }
            client.end();
        }
    );
};

router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        talkAction(response, client, user_id);
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    
    var con = process.env.DATABASE_URL;
    pg.connect(con, function(err, client) {
        talkAction(response, client, user_id);
    });
});
 
module.exports = router;