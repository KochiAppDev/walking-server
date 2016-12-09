var express = require('express');
var router = express.Router();
var pool = require('../lib/db_pool');
 
var talkAction = function(response, client, done, user_id) {
    client.query(
        "SELECT message_id as id, message_from as from, message_type as type, (CASE message_type WHEN 1 THEN to_char(icon, '9') WHEN 2 THEN image ELSE plain END) as ms, create_time as ts FROM message WHERE message_from = $1 OR message_to = $1 OR (message_to = -1 AND (SELECT group_id FROM user_info WHERE user_id = $1) = (SELECT group_id FROM user_info WHERE user_id = message_from)) ORDER BY create_time",
        [user_id],
        function(err, result) {
            done();
            if (err) {
                console.log(err);
                response.status(500).json([]);
            } else {
                response.status(200).json(result.rows);
            }
        }
    );
};

router.get('/', function(request, response, next) {
    var user_id = request.query.id;
    
    pool.connect(function(err, client, done) {
        talkAction(response, client, done, user_id);
    });
});
 
router.post('/', function(request, response, next) {
    var user_id = request.body.id;
    
    pool.connect(function(err, client, done) {
        talkAction(response, client, done, user_id);
    });
});
 
module.exports = router;